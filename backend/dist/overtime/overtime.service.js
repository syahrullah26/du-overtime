"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.OvertimeService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
const library_1 = require("@prisma/client/runtime/library");
let OvertimeService = class OvertimeService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    calculateDuration(startTime, endTime) {
        const diff = endTime.getTime() - startTime.getTime();
        return Math.floor(diff / (1000 * 60));
    }
    async getFlatRate() {
        const setting = await this.prisma.globalSetting.findUnique({
            where: { key: 'FLAT_RATE_PER_HOUR' },
        });
        if (!setting) {
            throw new common_1.BadRequestException('Flat rate not configured');
        }
        return setting.value.toNumber();
    }
    calculateTotalPay(durationMin, ratePerHour) {
        const hours = durationMin / 60;
        return hours * ratePerHour;
    }
    async create(userId, dto) {
        const startTime = new Date(dto.startTime);
        const endTime = new Date(dto.endTime);
        if (endTime <= startTime) {
            throw new common_1.BadRequestException('End time must be after start time');
        }
        const durationMin = this.calculateDuration(startTime, endTime);
        if (durationMin < 30) {
            throw new common_1.BadRequestException('Minimum overtime duration is 30 minutes');
        }
        const flatRate = await this.getFlatRate();
        const totalPay = this.calculateTotalPay(durationMin, flatRate);
        const submission = await this.prisma.overtimeSubmission.create({
            data: {
                employeeId: userId,
                date: new Date(dto.date),
                startTime,
                endTime,
                durationMin,
                appliedRate: new library_1.Decimal(flatRate),
                totalPay: new library_1.Decimal(totalPay),
                reason: dto.reason,
                status: client_1.SubmissionStatus.PENDING_PIC,
            },
            include: {
                employee: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        department: true,
                    },
                },
            },
        });
        await this.prisma.overtimeLog.create({
            data: {
                submissionId: submission.id,
                actionBy: userId,
                action: 'CREATED',
                note: 'Overtime submission created',
            },
        });
        return submission;
    }
    async findAll(userId, userRole, query) {
        const { status, employeeId, page = 1, limit = 10 } = query;
        const skip = (page - 1) * limit;
        const where = {};
        if (userRole === client_1.UserRole.EMPLOYEE) {
            where.employeeId = userId;
        }
        else if (employeeId) {
            where.employeeId = employeeId;
        }
        if (status) {
            where.status = status;
        }
        const [submissions, total] = await Promise.all([
            this.prisma.overtimeSubmission.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    employee: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            role: true,
                            department: true,
                        },
                    },
                    logs: {
                        orderBy: { createdAt: 'desc' },
                        include: {
                            user: {
                                select: {
                                    id: true,
                                    name: true,
                                    role: true,
                                },
                            },
                        },
                    },
                },
            }),
            this.prisma.overtimeSubmission.count({ where }),
        ]);
        return {
            data: submissions,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async getPendingApprovals(userId, userRole) {
        let status;
        switch (userRole) {
            case client_1.UserRole.PIC:
                status = client_1.SubmissionStatus.PENDING_PIC;
                break;
            case client_1.UserRole.C_LEVEL:
                status = client_1.SubmissionStatus.PENDING_C_LEVEL;
                break;
            case client_1.UserRole.HRD:
                status = client_1.SubmissionStatus.PENDING_HRD;
                break;
            default:
                return { data: [], count: 0 };
        }
        const submissions = await this.prisma.overtimeSubmission.findMany({
            where: { status },
            orderBy: { createdAt: 'asc' },
            include: {
                employee: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        department: true,
                    },
                },
            },
        });
        return {
            data: submissions,
            count: submissions.length,
        };
    }
    async findOne(id, userId, userRole) {
        const submission = await this.prisma.overtimeSubmission.findUnique({
            where: { id },
            include: {
                employee: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        role: true,
                        department: true,
                    },
                },
                logs: {
                    orderBy: { createdAt: 'desc' },
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                role: true,
                            },
                        },
                    },
                },
            },
        });
        if (!submission) {
            throw new common_1.NotFoundException('Overtime submission not found');
        }
        if (userRole === client_1.UserRole.EMPLOYEE && submission.employeeId !== userId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        return submission;
    }
    async approve(id, userId, userRole, dto) {
        const submission = await this.prisma.overtimeSubmission.findUnique({
            where: { id },
        });
        if (!submission) {
            throw new common_1.NotFoundException('Overtime submission not found');
        }
        let newStatus;
        let signatureField;
        let action;
        switch (submission.status) {
            case client_1.SubmissionStatus.PENDING_PIC:
                if (userRole !== client_1.UserRole.PIC) {
                    throw new common_1.ForbiddenException('Only PIC can approve at this stage');
                }
                newStatus = client_1.SubmissionStatus.PENDING_C_LEVEL;
                signatureField = 'signaturePic';
                action = 'APPROVED_BY_PIC';
                break;
            case client_1.SubmissionStatus.PENDING_C_LEVEL:
                if (userRole !== client_1.UserRole.C_LEVEL) {
                    throw new common_1.ForbiddenException('Only C-Level can approve at this stage');
                }
                newStatus = client_1.SubmissionStatus.PENDING_HRD;
                signatureField = 'signatureClevel';
                action = 'APPROVED_BY_C_LEVEL';
                break;
            case client_1.SubmissionStatus.PENDING_HRD:
                if (userRole !== client_1.UserRole.HRD) {
                    throw new common_1.ForbiddenException('Only HRD can approve at this stage');
                }
                newStatus = client_1.SubmissionStatus.COMPLETED;
                signatureField = 'signatureHrd';
                action = 'APPROVED_BY_HRD';
                break;
            default:
                throw new common_1.BadRequestException('Submission cannot be approved in current state');
        }
        const updated = await this.prisma.overtimeSubmission.update({
            where: { id },
            data: {
                status: newStatus,
                [signatureField]: dto.signature,
            },
            include: {
                employee: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        department: true,
                    },
                },
            },
        });
        await this.prisma.overtimeLog.create({
            data: {
                submissionId: id,
                actionBy: userId,
                action,
                note: dto.note,
            },
        });
        return updated;
    }
    async reject(id, userId, userRole, dto) {
        const submission = await this.prisma.overtimeSubmission.findUnique({
            where: { id },
        });
        if (!submission) {
            throw new common_1.NotFoundException('Overtime submission not found');
        }
        const canReject = (submission.status === client_1.SubmissionStatus.PENDING_PIC && userRole === client_1.UserRole.PIC) ||
            (submission.status === client_1.SubmissionStatus.PENDING_C_LEVEL && userRole === client_1.UserRole.C_LEVEL) ||
            (submission.status === client_1.SubmissionStatus.PENDING_HRD && userRole === client_1.UserRole.HRD);
        if (!canReject) {
            throw new common_1.ForbiddenException('You cannot reject this submission');
        }
        const updated = await this.prisma.overtimeSubmission.update({
            where: { id },
            data: {
                status: client_1.SubmissionStatus.REJECTED,
            },
            include: {
                employee: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        department: true,
                    },
                },
            },
        });
        await this.prisma.overtimeLog.create({
            data: {
                submissionId: id,
                actionBy: userId,
                action: 'REJECTED',
                note: dto.note,
            },
        });
        return updated;
    }
    async getStats(userId, userRole) {
        const where = {};
        if (userRole === client_1.UserRole.EMPLOYEE) {
            where.employeeId = userId;
        }
        const [total, pending, completed, rejected] = await Promise.all([
            this.prisma.overtimeSubmission.count({ where }),
            this.prisma.overtimeSubmission.count({
                where: {
                    ...where,
                    status: {
                        in: [client_1.SubmissionStatus.PENDING_PIC, client_1.SubmissionStatus.PENDING_C_LEVEL, client_1.SubmissionStatus.PENDING_HRD],
                    },
                },
            }),
            this.prisma.overtimeSubmission.count({
                where: { ...where, status: client_1.SubmissionStatus.COMPLETED },
            }),
            this.prisma.overtimeSubmission.count({
                where: { ...where, status: client_1.SubmissionStatus.REJECTED },
            }),
        ]);
        const submissions = await this.prisma.overtimeSubmission.findMany({
            where: { ...where, status: client_1.SubmissionStatus.COMPLETED },
            select: {
                durationMin: true,
                totalPay: true,
            },
        });
        const totalHours = submissions.reduce((sum, s) => sum + s.durationMin / 60, 0);
        const totalPay = submissions.reduce((sum, s) => sum + s.totalPay.toNumber(), 0);
        return {
            total,
            pending,
            completed,
            rejected,
            totalHours: Math.round(totalHours * 100) / 100,
            totalPay: Math.round(totalPay * 100) / 100,
        };
    }
};
exports.OvertimeService = OvertimeService;
exports.OvertimeService = OvertimeService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], OvertimeService);
//# sourceMappingURL=overtime.service.js.map