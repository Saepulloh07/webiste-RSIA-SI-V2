import { ApiPropertyOptional } from '@nestjs/swagger';
import { AdCampaignStatus } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsEnum, IsOptional } from 'class-validator';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';

const STATUS_LABEL_MAP: Record<string, AdCampaignStatus> = {
  aktif: AdCampaignStatus.AKTIF,
  berakhir: AdCampaignStatus.BERAKHIR,
  draft: AdCampaignStatus.DRAFT,
};

export class QueryAdDto extends PaginationQueryDto {
  @ApiPropertyOptional({ example: 'Aktif', enum: AdCampaignStatus })
  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? (STATUS_LABEL_MAP[value.toLowerCase()] ?? value) : value))
  @IsEnum(AdCampaignStatus)
  status?: AdCampaignStatus;
}

