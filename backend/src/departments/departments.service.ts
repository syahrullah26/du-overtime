import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DepartmentsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.department.findMany({
      include: {
        _count: {
          select: { users: true },
        },
      },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    const department = await this.prisma.department.findUnique({
      where: { id },
      include: {
        users: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });

    if (!department) {
      throw new NotFoundException('Department not found');
    }

    return department;
  }

  async create(name: string) {
    try {
      return await this.prisma.department.create({
        data: { name },
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('Department already exists');
      }
      throw error;
    }
  }

  async update(id: string, name: string) {
    try {
      return await this.prisma.department.update({
        where: { id },
        data: { name },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Department not found');
      }
      if (error.code === 'P2002') {
        throw new ConflictException('Department name already exists');
      }
      throw error;
    }
  }

  async remove(id: string) {
    try {
      return await this.prisma.department.delete({
        where: { id },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Department not found');
      }
      throw error;
    }
  }
}