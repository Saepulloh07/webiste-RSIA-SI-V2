import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

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
  /** Gambar/visual peta yang tampil pada bagian Kontak di Beranda. */
  @ApiPropertyOptional() @IsOptional() @IsString() mapsImageUrl?: string;
  /** Video profil "Tur Fasilitas & Edukasi Medis" (YouTube atau file video langsung). */
  @ApiPropertyOptional() @IsOptional() @IsString() videoUrl?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() @MaxLength(255) videoTitle?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() videoThumbnailUrl?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() instagram?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() facebook?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() youtube?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() tiktok?: string;
}