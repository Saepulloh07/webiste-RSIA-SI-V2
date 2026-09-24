import { ApiPropertyOptional } from '@nestjs/swagger';
import { MediaType } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class UploadMediaDto {
  @ApiPropertyOptional({ enum: MediaType, default: MediaType.IMAGE })
  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? value.toUpperCase() : value))
  @IsEnum(MediaType, {
    message: 'type harus salah satu dari: image, video, document, slideshow, website_image',
  })
  type?: MediaType;

  @ApiPropertyOptional({ example: 'Foto gedung utama RSIA Sayang Ibu' })
  @IsOptional()
  @Transform(({ value }) => (value === '' || value === null ? undefined : value))
  @IsString()
  description?: string;
}

