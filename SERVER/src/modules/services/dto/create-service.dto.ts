import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ServiceStatus } from '@prisma/client';
import { ArrayNotEmpty, IsArray, IsEnum, IsNotEmpty, IsOptional, IsString, IsUrl, MaxLength } from 'class-validator';

export class CreateServiceDto {
  @ApiProperty({ example: 'Laboratorium 24 Jam' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(150)
  name: string;

  @ApiProperty({ example: 'Penunjang Medis' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  category: string;

  @ApiPropertyOptional({ enum: ServiceStatus, default: ServiceStatus.AKTIF })
  @IsOptional()
  @IsEnum(ServiceStatus, { message: 'status harus salah satu dari: Aktif, Nonaktif' })
  status?: ServiceStatus;

  @ApiProperty({ example: 'Layanan pemeriksaan sampel darah dan laboratorium siaga 24 jam.' })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiPropertyOptional({ example: 'https://storage.sayangibu.co.id/services/lab.jpg' })
  @IsOptional()
  @IsString()
  image?: string;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  facilities?: string[];

  @ApiPropertyOptional({ example: '24 Jam Penuh Setiap Hari' })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  operationalHours?: string;
}
