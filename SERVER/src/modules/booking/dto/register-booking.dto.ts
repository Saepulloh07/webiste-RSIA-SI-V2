import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

/**
 * Body for POST /api/v1/register (Section 3.6). Field names/lengths taken
 * from the `booking_periksa` mapping documented in
 * "TABEL DATABASE SIMRS TERKAIT & PEMETAAN".
 */
export class RegisterBookingDto {
  @ApiProperty({ example: 'Ny. Rahmawati' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(40)
  nama: string;

  @ApiProperty({ example: 'Jl. Sudirman No. 12, Batusangkar' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(200)
  alamat: string;

  @ApiProperty({ example: '628123456789' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(40)
  noTelp: string;

  @ApiPropertyOptional({ example: 'rahmawati@example.com' })
  @IsOptional()
  @IsEmail()
  @MaxLength(50)
  email?: string;

  @ApiProperty({ example: '02', description: 'kode poliklinik tujuan (lihat GET /api/v1/poliklinik)' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(5)
  kdPoli: string;

  @ApiProperty({ example: '2026-09-25' })
  @IsNotEmpty()
  @IsDateString()
  tanggal: string;

  @ApiPropertyOptional({ example: 'Kontrol kehamilan rutin trimester 3' })
  @IsOptional()
  @IsString()
  @MaxLength(400)
  tambahanPesan?: string;
}
