import { PrismaService } from '../prisma/prisma.service';
import { CreateOvertimeDto, ApproveOvertimeDto, RejectOvertimeDto, QueryOvertimeDto } from './dto/overtime.dto';
import { UserRole } from '@prisma/client';
export declare class OvertimeService {
    private prisma;
    constructor(prisma: PrismaService);
    private calculateDuration;
    private getFlatRate;
    private calculateTotalPay;
    create(userId: string, dto: CreateOvertimeDto): unknown;
    findAll(userId: string, userRole: UserRole, query: QueryOvertimeDto): unknown;
    getPendingApprovals(userId: string, userRole: UserRole): unknown;
    findOne(id: string, userId: string, userRole: UserRole): unknown;
    approve(id: string, userId: string, userRole: UserRole, dto: ApproveOvertimeDto): unknown;
    reject(id: string, userId: string, userRole: UserRole, dto: RejectOvertimeDto): unknown;
    getStats(userId: string, userRole: UserRole): unknown;
}
