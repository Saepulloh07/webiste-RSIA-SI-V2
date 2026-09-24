import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DoctorStatus } from '@prisma/client';
import { Transform } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

const STATUS_LABEL_MAP: Record<string, DoctorStatus> = {
  aktif: DoctorStatus.AKTIF,
  cuti: DoctorStatus.CUTI,
  nonaktif: DoctorStatus.NONAKTIF,
};
const normalizeDoctorStatus = ({ value }: { value: unknown }) =>
  typeof value === 'string' ? (STATUS_LABEL_MAP[value.toLowerCase()] ?? value) : value;

export class CreateDoctorDto {
  @ApiProperty({ example: 'dr. Budi Santoso, Sp.A' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(150)
  name: string;

  @ApiProperty({ example: 'Anak' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  specialty: string;

  @ApiPropertyOptional({ example: 'Tumbuh Kembang & Pediatrik Sosial' })
  @IsOptional()
  @Transform(({ value }) => (value === '' || value === null ? undefined : value))
  @IsString()
  @MaxLength(150)
  subspecialty?: string;

  @ApiPropertyOptional({ example: 'Aktif', enum: DoctorStatus, default: DoctorStatus.AKTIF })
  @IsOptional()
  @Transform(normalizeDoctorStatus)
  @IsEnum(DoctorStatus, { message: 'status harus salah satu dari: Aktif, Cuti, Nonaktif' })
  status?: DoctorStatus;

  @ApiProperty({ example: 'Selasa & Kamis, 14:00 - 20:00' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  schedule: string;

  @ApiPropertyOptional({ example: '503/SIP.DS/DPM-PTSP/2020' })
  @IsOptional()
  @Transform(({ value }) => (value === '' || value === null ? undefined : value))
  @IsString()
  @MaxLength(100)
  sipNumber?: string;

  @ApiPropertyOptional({ example: 'Poli Anak Lantai 1' })
  @IsOptional()
  @Transform(({ value }) => (value === '' || value === null ? undefined : value))
  @IsString()
  @MaxLength(100)
  poliklinik?: string;

  @ApiPropertyOptional({ example: 'https://storage.sayangibu.co.id/doctors/dr-budi.jpg' })
  @IsOptional()
  @Transform(({ value }) => (value === '' || value === null ? undefined : value))
  @IsString()
  image?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => (value === '' || value === null ? undefined : value))
  @IsString()
  bio?: string;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  education?: string[];
}

