import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ServiceStatus } from '@prisma/client';
import { Transform } from 'class-transformer';
import { ArrayNotEmpty, IsArray, IsEnum, IsNotEmpty, IsOptional, IsString, IsUrl, MaxLength } from 'class-validator';

/** Menormalkan input "Aktif"/"Nonaktif" (sesuai API_DOCUMENTATION.txt) menjadi key enum Prisma. */
const STATUS_LABEL_MAP: Record<string, ServiceStatus> = {
  aktif: ServiceStatus.AKTIF,
  nonaktif: ServiceStatus.NONAKTIF,
};
const normalizeServiceStatus = ({ value }: { value: unknown }) => {
  if (value === '' || value === null || value === undefined) return ServiceStatus.AKTIF;
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) return ServiceStatus.AKTIF;
    const lower = trimmed.toLowerCase();
    if (STATUS_LABEL_MAP[lower]) return STATUS_LABEL_MAP[lower];
    if (lower === 'aktif') return ServiceStatus.AKTIF;
    if (lower === 'nonaktif') return ServiceStatus.NONAKTIF;
    if (Object.values(ServiceStatus).includes(trimmed as ServiceStatus)) {
      return trimmed as ServiceStatus;
    }
  }
  return value;
};

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
  @Transform(({ value }) => (typeof value === 'string' && value.trim() ? value.trim() : undefined))
  @IsString()
  image?: string;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @Transform(({ value }) => {
    if (!value) return undefined;
    if (typeof value === 'string') {
      try {
        const parsed = JSON.parse(value);
        if (Array.isArray(parsed)) return parsed.map((s) => String(s).trim()).filter(Boolean);
      } catch {
        return value.split('\n').map((s) => s.trim()).filter(Boolean);
      }
    }
    if (Array.isArray(value)) {
      return value.map((s) => String(s).trim()).filter(Boolean);
    }
    return undefined;
  })
  @IsArray()
  @IsString({ each: true })
  facilities?: string[];

  @ApiPropertyOptional({ example: '24 Jam Penuh Setiap Hari' })
  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' && value.trim() ? value.trim() : undefined))
  @IsString()
  @MaxLength(150)
  operationalHours?: string;
}