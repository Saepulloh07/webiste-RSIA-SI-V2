import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AdCampaignStatus } from '@prisma/client';
import { ArrayNotEmpty, IsArray, IsDateString, IsEnum, IsNotEmpty, IsOptional, IsString, IsUrl, MaxLength } from 'class-validator';

export class CreateAdDto {
  @ApiProperty({ example: 'Paket Persalinan Hemat Akhir Tahun' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  title: string;

  @ApiPropertyOptional({ example: 'Promo Spesial' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  badge?: string;

  @ApiPropertyOptional({ example: 'Rp 4.500.000' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  price?: string;

  @ApiPropertyOptional({ example: 'Rp 6.000.000' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  originalPrice?: string;

  @ApiProperty({ example: '2026-12-01' })
  @IsNotEmpty()
  @IsDateString()
  startDate: string;

  @ApiProperty({ example: '2026-12-31' })
  @IsNotEmpty()
  @IsDateString()
  endDate: string;

  @ApiPropertyOptional({ enum: AdCampaignStatus, default: AdCampaignStatus.DRAFT })
  @IsOptional()
  @IsEnum(AdCampaignStatus, { message: 'status harus salah satu dari: Aktif, Berakhir, Draft' })
  status?: AdCampaignStatus;

  @ApiProperty({ example: '<p>Nikmati promo persalinan normal dengan fasilitas lengkap...</p>' })
  @IsNotEmpty()
  @IsString()
  content: string;

  @ApiPropertyOptional({ example: 'https://storage.sayangibu.co.id/ads/promo-desember.jpg' })
  @IsOptional()
  @IsString()
  image?: string;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  highlights?: string[];

  @ApiPropertyOptional({ example: 'promo persalinan batusangkar, paket lahiran murah' })
  @IsOptional()
  @IsString()
  targetKeywords?: string;

  @ApiPropertyOptional({ example: '628123456789' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  contactWa?: string;
}
