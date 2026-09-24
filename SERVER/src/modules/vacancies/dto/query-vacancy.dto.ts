import { ApiPropertyOptional } from '@nestjs/swagger';
import { VacancyStatus, VacancyType } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';

const TYPE_LABEL_MAP: Record<string, VacancyType> = {
  'full time': VacancyType.FULL_TIME,
  'part time': VacancyType.PART_TIME,
  kontrak: VacancyType.KONTRAK,
};
const STATUS_LABEL_MAP: Record<string, VacancyStatus> = {
  published: VacancyStatus.PUBLISHED,
  draft: VacancyStatus.DRAFT,
};

export class QueryVacancyDto extends PaginationQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  department?: string;

  @ApiPropertyOptional({ example: 'Full Time', enum: VacancyType })
  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? (TYPE_LABEL_MAP[value.toLowerCase()] ?? value) : value))
  @IsEnum(VacancyType)
  type?: VacancyType;

  @ApiPropertyOptional({ example: 'Published', enum: VacancyStatus })
  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? (STATUS_LABEL_MAP[value.toLowerCase()] ?? value) : value))
  @IsEnum(VacancyStatus)
  status?: VacancyStatus;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @Transform(({ value }) => value === true || value === 'true')
  @IsBoolean()
  all?: boolean;
}