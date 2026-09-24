import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DoctorStatus } from '@prisma/client';
import {
  ArrayNotEmpty,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
} from 'class-validator';

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
  @IsString()
  @MaxLength(150)
  subspecialty?: string;

  @ApiPropertyOptional({ enum: DoctorStatus, default: DoctorStatus.AKTIF })
  @IsOptional()
  @IsEnum(DoctorStatus, { message: 'status harus salah satu dari: Aktif, Cuti, Nonaktif' })
  status?: DoctorStatus;

  @ApiProperty({ example: 'Selasa & Kamis, 14:00 - 20:00' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  schedule: string;

  @ApiPropertyOptional({ example: '503/SIP.DS/DPM-PTSP/2020' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  sipNumber?: string;

  @ApiPropertyOptional({ example: 'Poli Anak Lantai 1' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  poliklinik?: string;

  @ApiPropertyOptional({ example: 'https://storage.sayangibu.co.id/doctors/dr-budi.jpg' })
  @IsOptional()
  @IsString()
  image?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  education?: string[];
}
