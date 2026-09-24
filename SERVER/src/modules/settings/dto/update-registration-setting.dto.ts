import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class UpdateRegistrationSettingDto {
  @ApiPropertyOptional() @IsOptional() @IsBoolean() isOpen?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsInt() @Min(1) maxDailyQuota?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() noticeMessage?: string;
}
