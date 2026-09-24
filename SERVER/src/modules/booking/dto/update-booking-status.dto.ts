import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsString } from 'class-validator';

/** Body for POST /api/v1/update-status - Internal/Admin only. */
export class UpdateBookingStatusDto {
  @ApiProperty({ example: 'BP202609250001' })
  @IsNotEmpty()
  @IsString()
  noBooking: string;

  @ApiProperty({ example: 'Diterima', enum: ['Diterima', 'Ditolak', 'Belum Dibalas'] })
  @IsNotEmpty()
  @IsIn(['Diterima', 'Ditolak', 'Belum Dibalas'], {
    message: 'status harus salah satu dari: Diterima, Ditolak, Belum Dibalas',
  })
  status: string;
}
