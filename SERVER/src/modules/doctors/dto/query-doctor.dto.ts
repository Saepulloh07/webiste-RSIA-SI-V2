import { ApiPropertyOptional } from '@nestjs/swagger';
import { DoctorStatus } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';

const STATUS_LABEL_MAP: Record<string, DoctorStatus> = {
  aktif: DoctorStatus.AKTIF,
  cuti: DoctorStatus.CUTI,
  nonaktif: DoctorStatus.NONAKTIF,
};

export class QueryDoctorDto extends PaginationQueryDto {
  @ApiPropertyOptional({ example: 'Kandungan' })
  @IsOptional()
  @IsString()
  specialty?: string;

  @ApiPropertyOptional({ example: 'Aktif', enum: DoctorStatus })
  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? (STATUS_LABEL_MAP[value.toLowerCase()] ?? value) : value))
  @IsEnum(DoctorStatus)
  status?: DoctorStatus;
}

