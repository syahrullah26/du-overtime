import { PrismaService } from '../prisma/prisma.service';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): unknown;
    findOne(id: string): unknown;
    findByRole(role: string): unknown;
    findByDepartment(deptId: string): unknown;
}
