import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

/**
 * Standard pagination/search query params, per Section 1.3:
 *   page (default 1), limit (default 10, max 100), search, sort
 */
export class PaginationQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @IsOptional()
  @IsString()
  search?: string;

  /** e.g. "-created_at" or "name:asc" */
  @IsOptional()
  @IsString()
  sort?: string;
}
