import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { UsersService } from '../services/users.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { QueryUserDto } from '../dto/query-user.dto';
import { Roles } from '../../../common/decorators/roles.decorator';

// Every endpoint here is Super Admin only, per Section 3 "Manajemen Pengguna CMS".
@ApiTags('Users')
@ApiBearerAuth()
@Roles(UserRole.SUPER_ADMIN)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async list(@Query() query: QueryUserDto) {
    const { data, meta } = await this.usersService.list(query);
    return { message: 'Daftar pengguna berhasil diambil.', data, meta };
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateUserDto) {
    const data = await this.usersService.create(dto);
    return { message: 'Pengguna baru berhasil ditambahkan.', data };
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    const data = await this.usersService.update(id, dto);
    return { message: 'Data pengguna berhasil diperbarui.', data };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.usersService.remove(id);
    return { message: 'Pengguna berhasil dihapus.', data: null };
  }
}
