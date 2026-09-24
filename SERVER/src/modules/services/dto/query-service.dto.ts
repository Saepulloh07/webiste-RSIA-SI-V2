import { ApiPropertyOptional } from '@nestjs/swagger';
import { ServiceStatus } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';

const STATUS_LABEL_MAP: Record<string, ServiceStatus> = {
  aktif: ServiceStatus.AKTIF,
  nonaktif: ServiceStatus.NONAKTIF,
};

export class QueryServiceDto extends PaginationQueryDto {
  @ApiPropertyOptional({ example: 'Poliklinik' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({ example: 'Aktif', enum: ServiceStatus })
  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? (STATUS_LABEL_MAP[value.toLowerCase()] ?? value) : value))
  @IsEnum(ServiceStatus)
  status?: ServiceStatus;
}