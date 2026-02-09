import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { OvertimeService } from './overtime.service';
import { CreateOvertimeDto, ApproveOvertimeDto, RejectOvertimeDto, QueryOvertimeDto } from './dto/overtime.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('overtime')
@UseGuards(JwtAuthGuard)
export class OvertimeController {
  constructor(private readonly overtimeService: OvertimeService) {}

  /**
   * create pengajuan (employee only)
   */
  @Post()
  @Roles(UserRole.EMPLOYEE)
  create(@Request() req, @Body() createOvertimeDto: CreateOvertimeDto) {
    return this.overtimeService.create(req.user.id, createOvertimeDto);
  }

  /**
   * Get semua pengajuan by filter
   */
  @Get()
  findAll(@Request() req, @Query() query: QueryOvertimeDto) {
    return this.overtimeService.findAll(req.user.id, req.user.role, query);
  }

  /**
   * Get pending pengajuan tiap user 
   */
  @Get('pending')
  @Roles(UserRole.PIC, UserRole.C_LEVEL, UserRole.HRD)
  getPendingApprovals(@Request() req) {
    return this.overtimeService.getPendingApprovals(req.user.id, req.user.role);
  }

  /**
   * Get statistik lemburan
   */
  @Get('stats')
  getStats(@Request() req) {
    return this.overtimeService.getStats(req.user.id, req.user.role);
  }

  /**
   * get single pengajuan
   */
  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.overtimeService.findOne(id, req.user.id, req.user.role);
  }

  /**
   * approve pengajuan
   */
  @Patch(':id/approve')
  @Roles(UserRole.PIC, UserRole.C_LEVEL, UserRole.HRD)
  approve(@Param('id') id: string, @Request() req, @Body() approveDto: ApproveOvertimeDto) {
    return this.overtimeService.approve(id, req.user.id, req.user.role, approveDto);
  }

  /**
   * reject pengajuan
   */
  @Patch(':id/reject')
  @Roles(UserRole.PIC, UserRole.C_LEVEL, UserRole.HRD)
  reject(@Param('id') id: string, @Request() req, @Body() rejectDto: RejectOvertimeDto) {
    return this.overtimeService.reject(id, req.user.id, req.user.role, rejectDto);
  }
}
