import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateRegistrationSettingDto {
  @ApiPropertyOptional() @IsOptional() @IsBoolean() isOpen?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsString() noticeMessage?: string;
}