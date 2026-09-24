import { ApiPropertyOptional } from '@nestjs/swagger';
import { ArticleStatus } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';

const STATUS_LABEL_MAP: Record<string, ArticleStatus> = {
  published: ArticleStatus.PUBLISHED,
  draft: ArticleStatus.DRAFT,
};

export class QueryArticleDto extends PaginationQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({ example: 'Published', enum: ArticleStatus })
  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? (STATUS_LABEL_MAP[value.toLowerCase()] ?? value) : value))
  @IsEnum(ArticleStatus)
  status?: ArticleStatus;

  /** CMS only: sertakan semua status (bukan hanya Published). Sekarang field DTO yang sah
   *  (sebelumnya dipaksakan lewat intersection type di controller, yang membuat
   *  ValidationPipe tidak jalan sama sekali untuk endpoint ini → 500). */
  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @Transform(({ value }) => value === true || value === 'true')
  @IsBoolean()
  all?: boolean;
}