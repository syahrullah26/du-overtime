import { IsNotEmpty, IsString, IsDateString, IsOptional, IsInt, Min } from 'class-validator';

export class CreateOvertimeDto {
  @IsDateString()
  @IsNotEmpty()
  date: string;

  @IsDateString()
  @IsNotEmpty()
  startTime: string;

  @IsDateString()
  @IsNotEmpty()
  endTime: string;

  @IsString()
  @IsOptional()
  reason?: string;
}

export class ApproveOvertimeDto {
  @IsString()
  @IsOptional()
  signature?: string; // Base64 string atau path file

  @IsString()
  @IsOptional()
  note?: string;
}

export class RejectOvertimeDto {
  @IsString()
  @IsNotEmpty()
  note: string;
}

export class QueryOvertimeDto {
  @IsString()
  @IsOptional()
  status?: string;

  @IsString()
  @IsOptional()
  employeeId?: string;

  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number = 1;

  @IsInt()
  @Min(1)
  @IsOptional()
  limit?: number = 10;
}