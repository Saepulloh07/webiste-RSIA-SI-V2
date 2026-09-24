import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ArticleStatus } from '@prisma/client';
import { ArrayNotEmpty, IsArray, IsEnum, IsNotEmpty, IsOptional, IsString, IsUrl, MaxLength } from 'class-validator';

export class CreateArticleDto {
  @ApiProperty({ example: 'Pentingnya Imunisasi Dasar Lengkap pada Bayi' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  title: string;

  @ApiProperty({ example: 'Kesehatan Anak' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  category: string;

  @ApiPropertyOptional({ enum: ArticleStatus, default: ArticleStatus.DRAFT })
  @IsOptional()
  @IsEnum(ArticleStatus, { message: 'status harus salah satu dari: Published, Draft' })
  status?: ArticleStatus;

  @ApiPropertyOptional({ example: 'dr. Budi Santoso, Sp.A' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  author?: string;

  @ApiProperty({ example: '<p>Imunisasi memberikan perlindungan optimal...</p>' })
  @IsNotEmpty()
  @IsString()
  content: string;

  @ApiPropertyOptional({ example: 'https://storage.sayangibu.co.id/articles/imunisasi.jpg' })
  @IsOptional()
  @IsString()
  image?: string;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}
