import { ApiPropertyOptional } from '@nestjs/swagger';
import { AdCampaignStatus } from '@prisma/client';
import { IsEnum, IsOptional } from 'class-validator';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';

export class QueryAdDto extends PaginationQueryDto {
  @ApiPropertyOptional({ enum: AdCampaignStatus })
  @IsOptional()
  @IsEnum(AdCampaignStatus)
  status?: AdCampaignStatus;
}
