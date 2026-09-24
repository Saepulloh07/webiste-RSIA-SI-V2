import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ServiceStatus } from '@prisma/client';
import { Transform } from 'class-transformer';
import { ArrayNotEmpty, IsArray, IsEnum, IsNotEmpty, IsOptional, IsString, IsUrl, MaxLength } from 'class-validator';

/** Menormalkan input "Aktif"/"Nonaktif" (sesuai API_DOCUMENTATION.txt) menjadi key enum Prisma. */
const STATUS_LABEL_MAP: Record<string, ServiceStatus> = {
  aktif: ServiceStatus.AKTIF,
  nonaktif: ServiceStatus.NONAKTIF,
};
const normalizeServiceStatus = ({ value }: { value: unknown }) =>
  typeof value === 'string' ? (STATUS_LABEL_MAP[value.toLowerCase()] ?? value) : value;

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

  @ApiPropertyOptional({ example: 'Aktif', enum: ServiceStatus, default: ServiceStatus.AKTIF })
  @IsOptional()
  @Transform(normalizeServiceStatus)
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