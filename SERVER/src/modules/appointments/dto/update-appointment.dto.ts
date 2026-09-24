import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { AppointmentStatus } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsEnum, IsOptional } from 'class-validator';
import { CreateAppointmentDto } from './create-appointment.dto';

export class UpdateAppointmentDto extends PartialType(CreateAppointmentDto) {
  @ApiPropertyOptional({ enum: AppointmentStatus, example: AppointmentStatus.DIKONFIRMASI })
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
  @IsEnum(AppointmentStatus, { message: 'status harus Menunggu, Dikonfirmasi, Selesai, atau Batal' })
  status?: AppointmentStatus;
}

