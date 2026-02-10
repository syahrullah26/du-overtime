import { PrismaService } from '../prisma/prisma.service';
export declare class DepartmentsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): unknown;
    findOne(id: string): unknown;
    create(name: string): unknown;
    update(id: string, name: string): unknown;
    remove(id: string): unknown;
}
