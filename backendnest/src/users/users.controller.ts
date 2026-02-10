import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles(UserRole.HRD, UserRole.FINANCE, UserRole.C_LEVEL)
  findAll() {
    return this.usersService.findAll();
  }

  @Get('role/:role')
  @Roles(UserRole.HRD, UserRole.FINANCE, UserRole.C_LEVEL)
  findByRole(@Param('role') role: string) {
    return this.usersService.findByRole(role);
  }

  @Get('department/:deptId')
  @Roles(UserRole.HRD, UserRole.FINANCE, UserRole.C_LEVEL, UserRole.PIC)
  findByDepartment(@Param('deptId') deptId: string) {
    return this.usersService.findByDepartment(deptId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }
}