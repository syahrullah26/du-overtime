import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { DepartmentsService } from './departments.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '@prisma/client';
import { IsNotEmpty, IsString } from 'class-validator';

class CreateDepartmentDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}

@Controller('departments')
@UseGuards(JwtAuthGuard)
export class DepartmentsController {
  constructor(private readonly departmentsService: DepartmentsService) {}

  @Get()
  findAll() {
    return this.departmentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.departmentsService.findOne(id);
  }

  @Post()
  @Roles(UserRole.HRD, UserRole.C_LEVEL)
  create(@Body() dto: CreateDepartmentDto) {
    return this.departmentsService.create(dto.name);
  }

  @Put(':id')
  @Roles(UserRole.HRD, UserRole.C_LEVEL)
  update(@Param('id') id: string, @Body() dto: CreateDepartmentDto) {
    return this.departmentsService.update(id, dto.name);
  }

  @Delete(':id')
  @Roles(UserRole.HRD, UserRole.C_LEVEL)
  remove(@Param('id') id: string) {
    return this.departmentsService.remove(id);
  }
}
