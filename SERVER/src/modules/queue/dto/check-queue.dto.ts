import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

/** Body for POST /api/queue/check - looks up today's queue number for a phone/registration. */
export class CheckQueueDto {
  @ApiProperty({ example: '628123456789' })
  @IsNotEmpty()
  @IsString()
  noTelp: string;
}
