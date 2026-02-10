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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d, _e;
Object.defineProperty(exports, "__esModule", { value: true });
exports.OvertimeController = void 0;
const common_1 = require("@nestjs/common");
const overtime_service_1 = require("./overtime.service");
const overtime_dto_1 = require("./dto/overtime.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const client_1 = require("@prisma/client");
let OvertimeController = class OvertimeController {
    constructor(overtimeService) {
        this.overtimeService = overtimeService;
    }
    create(req, createOvertimeDto) {
        return this.overtimeService.create(req.user.id, createOvertimeDto);
    }
    findAll(req, query) {
        return this.overtimeService.findAll(req.user.id, req.user.role, query);
    }
    getPendingApprovals(req) {
        return this.overtimeService.getPendingApprovals(req.user.id, req.user.role);
    }
    getStats(req) {
        return this.overtimeService.getStats(req.user.id, req.user.role);
    }
    findOne(id, req) {
        return this.overtimeService.findOne(id, req.user.id, req.user.role);
    }
    approve(id, req, approveDto) {
        return this.overtimeService.approve(id, req.user.id, req.user.role, approveDto);
    }
    reject(id, req, rejectDto) {
        return this.overtimeService.reject(id, req.user.id, req.user.role, rejectDto);
    }
};
exports.OvertimeController = OvertimeController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(client_1.UserRole.EMPLOYEE),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_b = typeof overtime_dto_1.CreateOvertimeDto !== "undefined" && overtime_dto_1.CreateOvertimeDto) === "function" ? _b : Object]),
    __metadata("design:returntype", void 0)
], OvertimeController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_c = typeof overtime_dto_1.QueryOvertimeDto !== "undefined" && overtime_dto_1.QueryOvertimeDto) === "function" ? _c : Object]),
    __metadata("design:returntype", void 0)
], OvertimeController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('pending'),
    (0, roles_decorator_1.Roles)(client_1.UserRole.PIC, client_1.UserRole.C_LEVEL, client_1.UserRole.HRD),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], OvertimeController.prototype, "getPendingApprovals", null);
__decorate([
    (0, common_1.Get)('stats'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], OvertimeController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], OvertimeController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id/approve'),
    (0, roles_decorator_1.Roles)(client_1.UserRole.PIC, client_1.UserRole.C_LEVEL, client_1.UserRole.HRD),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, typeof (_d = typeof overtime_dto_1.ApproveOvertimeDto !== "undefined" && overtime_dto_1.ApproveOvertimeDto) === "function" ? _d : Object]),
    __metadata("design:returntype", void 0)
], OvertimeController.prototype, "approve", null);
__decorate([
    (0, common_1.Patch)(':id/reject'),
    (0, roles_decorator_1.Roles)(client_1.UserRole.PIC, client_1.UserRole.C_LEVEL, client_1.UserRole.HRD),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, typeof (_e = typeof overtime_dto_1.RejectOvertimeDto !== "undefined" && overtime_dto_1.RejectOvertimeDto) === "function" ? _e : Object]),
    __metadata("design:returntype", void 0)
], OvertimeController.prototype, "reject", null);
exports.OvertimeController = OvertimeController = __decorate([
    (0, common_1.Controller)('overtime'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [typeof (_a = typeof overtime_service_1.OvertimeService !== "undefined" && overtime_service_1.OvertimeService) === "function" ? _a : Object])
], OvertimeController);
//# sourceMappingURL=overtime.controller.js.map