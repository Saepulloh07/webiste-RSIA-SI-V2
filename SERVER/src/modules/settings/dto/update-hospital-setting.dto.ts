import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUrl } from 'class-validator';

export class UpdateHospitalSettingDto {
  @ApiPropertyOptional() @IsOptional() @IsString() hospitalName?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() slogan?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() aboutText?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() operationalHours?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() logoUrl?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() phoneCs?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() phoneEmergency?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() whatsapp?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() email?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() address?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() mapsUrl?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() mapsEmbed?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() instagram?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() facebook?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() youtube?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() tiktok?: string;
}
