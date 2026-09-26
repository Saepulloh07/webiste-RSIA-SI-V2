import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { VacancyStatus, VacancyType } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsDateString, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateVacancyDto {
  @ApiProperty({ example: 'Perawat Rawat Inap (Ners)' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(150)
  title: string;

  @ApiProperty({ example: 'Keperawatan' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  department: string;

  @ApiPropertyOptional({ enum: VacancyType, default: VacancyType.FULL_TIME })
  @IsOptional()
  @Transform(({ value }) => {
    if (!value) return value;
    const s = String(value).toUpperCase().replace(/\s+/g, '_');
    if (s === 'FULL_TIME') return VacancyType.FULL_TIME;
    if (s === 'PART_TIME') return VacancyType.PART_TIME;
    if (s === 'KONTRAK') return VacancyType.KONTRAK;
    return value;
  })
  @IsEnum(VacancyType, { message: 'type harus salah satu dari: Full Time, Part Time, Kontrak' })
  type?: VacancyType;

  @ApiPropertyOptional({ example: 'Batusangkar', default: 'Batusangkar' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  location?: string;

  @ApiPropertyOptional({ example: 'Minimal 1 tahun' })
  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' && value.trim() ? value.trim() : undefined))
  @IsString()
  @MaxLength(100)
  experience?: string;

  @ApiPropertyOptional({ example: '2026-12-31' })
  @IsOptional()
  @Transform(({ value }) => {
    if (!value || value === '' || value === null) return undefined;
    if (typeof value === 'string') {
      const trimmed = value.trim();
      if (!trimmed) return undefined;
      if (/^\d{4}-\d{2}-\d{2}/.test(trimmed)) return trimmed.slice(0, 10);
      const d = new Date(trimmed);
      if (!Number.isNaN(d.getTime())) return d.toISOString().slice(0, 10);
    }
    return undefined;
  })
  @IsDateString()
  deadline?: string;

  @ApiPropertyOptional({ enum: VacancyStatus, default: VacancyStatus.DRAFT })
  @IsOptional()
  @Transform(({ value }) => {
    if (!value) return VacancyStatus.DRAFT;
    const s = String(value).toUpperCase().trim();
    if (s === 'PUBLISHED') return VacancyStatus.PUBLISHED;
    if (s === 'DRAFT') return VacancyStatus.DRAFT;
    return VacancyStatus.DRAFT;
  })
  @IsEnum(VacancyStatus, { message: 'status harus salah satu dari: Published, Draft' })
  status?: VacancyStatus;

  @ApiProperty({ example: 'Bertanggung jawab atas asuhan keperawatan pasien rawat inap...' })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({ example: 'D3/S1 Keperawatan, STR aktif, mampu bekerja shift.' })
  @IsNotEmpty()
  @IsString()
  requirements: string;

  @ApiPropertyOptional({ example: 'karir@sayangibu.co.id' })
  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' && value.trim() ? value.trim() : undefined))
  @IsEmail()
  contactEmail?: string;

  @ApiPropertyOptional({ example: '628123456789' })
  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' && value.trim() ? value.trim() : undefined))
  @IsString()
  @MaxLength(30)
  contactWa?: string;
}

