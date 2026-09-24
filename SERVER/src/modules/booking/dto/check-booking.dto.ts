import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

/** Body for POST /api/v1/check - looks up a submitted booking by its booking number. */
export class CheckBookingDto {
  @ApiProperty({ example: 'BP202609250001' })
  @IsNotEmpty()
  @IsString()
  noBooking: string;
}
