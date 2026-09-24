import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AppointmentPatientType, AppointmentPaymentMethod, AppointmentStatus } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsDateString, IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateAppointmentDto {
  @ApiProperty({ example: 'Siti Nurhaliza' })
  @IsNotEmpty({ message: 'Nama lengkap harus diisi' })
  @IsString()
  @MinLength(3, { message: 'Nama lengkap minimal 3 karakter' })
  @MaxLength(150)
  patientName: string;

  @ApiProperty({ example: '081234567890' })
  @IsNotEmpty({ message: 'Nomor WhatsApp/HP harus diisi' })
  @IsString()
  @MaxLength(30)
  phone: string;

  @ApiProperty({ enum: AppointmentPatientType, example: AppointmentPatientType.BARU })
  @IsNotEmpty({ message: 'Pilih jenis pasien' })
  @Transform(({ value }) => {
    if (!value) return value;
    const s = String(value).toUpperCase();
    if (s === 'BARU') return AppointmentPatientType.BARU;
    if (s === 'LAMA') return AppointmentPatientType.LAMA;
    return value;
  })
  @IsEnum(AppointmentPatientType, { message: 'Jenis pasien harus "baru" atau "lama"' })
  patientType: AppointmentPatientType;

  @ApiProperty({ enum: AppointmentPaymentMethod, example: AppointmentPaymentMethod.UMUM })
  @IsNotEmpty({ message: 'Pilih metode pembayaran' })
  @Transform(({ value }) => {
    if (!value) return value;
    const s = String(value).toUpperCase();
    if (s === 'UMUM') return AppointmentPaymentMethod.UMUM;
    if (s === 'BPJS') return AppointmentPaymentMethod.BPJS;
    if (s === 'ASURANSI') return AppointmentPaymentMethod.ASURANSI;
    return value;
  })
  @IsEnum(AppointmentPaymentMethod, { message: 'Metode pembayaran harus "umum", "bpjs", atau "asuransi"' })
  paymentMethod: AppointmentPaymentMethod;

  @ApiProperty({ example: '1' })
  @IsNotEmpty({ message: 'Pilih poliklinik / layanan' })
  @IsString()
  @MaxLength(100)
  serviceId: string;

  @ApiPropertyOptional({ example: 'Kandungan & Kebidanan' })
  @IsOptional()
  @Transform(({ value }) => (value === '' || value === null ? undefined : value))
  @IsString()
  @MaxLength(150)
  serviceName?: string;

  @ApiProperty({ example: '1' })
  @IsNotEmpty({ message: 'Pilih dokter' })
  @IsString()
  @MaxLength(100)
  doctorId: string;

  @ApiPropertyOptional({ example: 'dr. Amanda Saraswati, Sp.OG' })
  @IsOptional()
  @Transform(({ value }) => (value === '' || value === null ? undefined : value))
  @IsString()
  @MaxLength(150)
  doctorName?: string;

  @ApiProperty({ example: '2026-09-25' })
  @IsNotEmpty({ message: 'Pilih tanggal kunjungan' })
  @IsDateString({}, { message: 'Format tanggal tidak valid' })
  date: string;

  @ApiPropertyOptional({ example: '09:00' })
  @IsOptional()
  @Transform(({ value }) => (value === '' || value === null ? undefined : value))
  @IsString()
  @MaxLength(20)
  time?: string;

  @ApiPropertyOptional({ example: 'Konsultasi trimester 2' })
  @IsOptional()
  @Transform(({ value }) => (value === '' || value === null ? undefined : value))
  @IsString()
  notes?: string;

  @ApiPropertyOptional({ enum: AppointmentStatus, default: AppointmentStatus.MENUNGGU })
  @IsOptional()
  @Transform(({ value }) => {
    if (!value) return value;
    const s = String(value).toUpperCase();
    if (s === 'MENUNGGU') return AppointmentStatus.MENUNGGU;
    if (s === 'DIKONFIRMASI') return AppointmentStatus.DIKONFIRMASI;
    if (s === 'SELESAI') return AppointmentStatus.SELESAI;
    if (s === 'BATAL') return AppointmentStatus.BATAL;
    return value;
  })
  @IsEnum(AppointmentStatus)
  status?: AppointmentStatus;
}

