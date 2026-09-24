import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'admin@sayangibu.co.id' })
  @IsNotEmpty({ message: 'email tidak boleh kosong' })
  @IsEmail({}, { message: 'email harus berupa format email yang valid' })
  email: string;

  @ApiProperty({ example: 'PasswordRahasia123!' })
  @IsNotEmpty({ message: 'password tidak boleh kosong' })
  @MinLength(6, { message: 'password minimal 6 karakter' })
  password: string;
}
