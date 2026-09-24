import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'Siti Aminah' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  name: string;

  @ApiProperty({ example: 'siti.aminah@sayangibu.co.id' })
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(150)
  email: string;

  @ApiProperty({ example: 'PasswordAman123!' })
  @IsNotEmpty()
  @MinLength(8, { message: 'password minimal 8 karakter' })
  password: string;

  @ApiPropertyOptional({ enum: UserRole, default: UserRole.EDITOR })
  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      const v = value.toUpperCase().replace(/[\s_-]+/g, '');
      if (v.includes('SUPER')) return UserRole.SUPER_ADMIN;
      if (v.includes('ADMIN')) return UserRole.ADMIN;
      if (v.includes('EDITOR')) return UserRole.EDITOR;
    }
    return value;
  })
  @IsEnum(UserRole, { message: 'role harus salah satu dari: Super Admin, Admin, Editor' })
  role?: UserRole;
}
