import { Injectable, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOvertimeDto, ApproveOvertimeDto, RejectOvertimeDto, QueryOvertimeDto } from './dto/overtime.dto';
import { SubmissionStatus, UserRole } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class OvertimeService {
  constructor(private prisma: PrismaService) {}

  /**
   * kalkulasi durasi dalam menit antara dua tanggal yang beda (kali) 
   */
  private calculateDuration(startTime: Date, endTime: Date): number {
    const diff = endTime.getTime() - startTime.getTime();
    return Math.floor(diff / (1000 * 60)); // convert menit
  }

  /**
   * get flat rate dari global seting dulu
   */
  private async getFlatRate(): Promise<number> {
    const setting = await this.prisma.globalSetting.findUnique({
      where: { key: 'FLAT_RATE_PER_HOUR' },
    });

    if (!setting) {
      throw new BadRequestException('Flat rate not configured');
    }

    return setting.value.toNumber();
  }

  /**
   * kalkulasi total pay berdasarkan durasi dan rate 
   */
  private calculateTotalPay(durationMin: number, ratePerHour: number): number {
    const hours = durationMin / 60;
    return hours * ratePerHour;
  }

  /**
   * Create pengajuan
   */
  async create(userId: string, dto: CreateOvertimeDto) {
    const startTime = new Date(dto.startTime);
    const endTime = new Date(dto.endTime);

    // validasi: selesai harus dipasang setelah mulai 
    if (endTime <= startTime) {
      throw new BadRequestException('End time must be after start time');
    }

    // durasi kalkulasi lembur
    const durationMin = this.calculateDuration(startTime, endTime);

    if (durationMin < 30) {
      throw new BadRequestException('Minimum overtime duration is 30 minutes');
    }

    // get flat rate pembayaran 
    const flatRate = await this.getFlatRate();

    // kalkulasi total pembayaran
    const totalPay = this.calculateTotalPay(durationMin, flatRate);

    // create pengajuan
    const submission = await this.prisma.overtimeSubmission.create({
      data: {
        employeeId: userId,
        date: new Date(dto.date),
        startTime,
        endTime,
        durationMin,
        appliedRate: new Decimal(flatRate),
        totalPay: new Decimal(totalPay),
        reason: dto.reason,
        status: SubmissionStatus.PENDING_PIC,
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

  /**
   * get semua lemburan dengan filter dan paginasi
   */
  async findAll(userId: string, userRole: UserRole, query: QueryOvertimeDto) {
    const { status, employeeId, page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const where: any = {};

    // role filtering
    if (userRole === UserRole.EMPLOYEE) {
      where.employeeId = userId;
    } else if (employeeId) {
      where.employeeId = employeeId;
    }

    // status filt
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

  /**
   * pending
   */
  async getPendingApprovals(userId: string, userRole: UserRole) {
    let status: SubmissionStatus;

    switch (userRole) {
      case UserRole.PIC:
        status = SubmissionStatus.PENDING_PIC;
        break;
      case UserRole.C_LEVEL:
        status = SubmissionStatus.PENDING_C_LEVEL;
        break;
      case UserRole.HRD:
        status = SubmissionStatus.PENDING_HRD;
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

  /**
   * Get single overtime submission
   */
  async findOne(id: string, userId: string, userRole: UserRole) {
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
      throw new NotFoundException('Overtime submission not found');
    }

    // guard per employe cuma bisa liat punya dia doang 
    if (userRole === UserRole.EMPLOYEE && submission.employeeId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return submission;
  }

  /**
   * approve lemburan
   */
  async approve(id: string, userId: string, userRole: UserRole, dto: ApproveOvertimeDto) {
    const submission = await this.prisma.overtimeSubmission.findUnique({
      where: { id },
    });

    if (!submission) {
      throw new NotFoundException('Overtime submission not found');
    }

    let newStatus: SubmissionStatus;
    let signatureField: string;
    let action: string;

    switch (submission.status) {
      case SubmissionStatus.PENDING_PIC:
        if (userRole !== UserRole.PIC) {
          throw new ForbiddenException('Only PIC can approve at this stage');
        }
        newStatus = SubmissionStatus.PENDING_C_LEVEL;
        signatureField = 'signaturePic';
        action = 'APPROVED_BY_PIC';
        break;

      case SubmissionStatus.PENDING_C_LEVEL:
        if (userRole !== UserRole.C_LEVEL) {
          throw new ForbiddenException('Only C-Level can approve at this stage');
        }
        newStatus = SubmissionStatus.PENDING_HRD;
        signatureField = 'signatureClevel';
        action = 'APPROVED_BY_C_LEVEL';
        break;

      case SubmissionStatus.PENDING_HRD:
        if (userRole !== UserRole.HRD) {
          throw new ForbiddenException('Only HRD can approve at this stage');
        }
        newStatus = SubmissionStatus.COMPLETED;
        signatureField = 'signatureHrd';
        action = 'APPROVED_BY_HRD';
        break;

      default:
        throw new BadRequestException('Submission cannot be approved in current state');
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

  /**
   * reject lemburan
   */
  async reject(id: string, userId: string, userRole: UserRole, dto: RejectOvertimeDto) {
    const submission = await this.prisma.overtimeSubmission.findUnique({
      where: { id },
    });

    if (!submission) {
      throw new NotFoundException('Overtime submission not found');
    }

    // cek permission nya 
    const canReject =
      (submission.status === SubmissionStatus.PENDING_PIC && userRole === UserRole.PIC) ||
      (submission.status === SubmissionStatus.PENDING_C_LEVEL && userRole === UserRole.C_LEVEL) ||
      (submission.status === SubmissionStatus.PENDING_HRD && userRole === UserRole.HRD);

    if (!canReject) {
      throw new ForbiddenException('You cannot reject this submission');
    }

    // Update submission
    const updated = await this.prisma.overtimeSubmission.update({
      where: { id },
      data: {
        status: SubmissionStatus.REJECTED,
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

    // Create log
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

  /**
   * get overtime stats buat di dashboard
   */
  async getStats(userId: string, userRole: UserRole) {
    const where: any = {};

    if (userRole === UserRole.EMPLOYEE) {
      where.employeeId = userId;
    }

    const [total, pending, completed, rejected] = await Promise.all([
      this.prisma.overtimeSubmission.count({ where }),
      this.prisma.overtimeSubmission.count({
        where: {
          ...where,
          status: {
            in: [SubmissionStatus.PENDING_PIC, SubmissionStatus.PENDING_C_LEVEL, SubmissionStatus.PENDING_HRD],
          },
        },
      }),
      this.prisma.overtimeSubmission.count({
        where: { ...where, status: SubmissionStatus.COMPLETED },
      }),
      this.prisma.overtimeSubmission.count({
        where: { ...where, status: SubmissionStatus.REJECTED },
      }),
    ]);

    // kalkulasi total jam lembur dan bayaran
    const submissions = await this.prisma.overtimeSubmission.findMany({
      where: { ...where, status: SubmissionStatus.COMPLETED },
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
}