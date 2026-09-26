import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { VacanciesService } from '../services/vacancies.service';
import { CreateVacancyDto } from '../dto/create-vacancy.dto';
import { UpdateVacancyDto } from '../dto/update-vacancy.dto';
import { QueryVacancyDto } from '../dto/query-vacancy.dto';
import { Public } from '../../../common/decorators/public.decorator';
import { Roles } from '../../../common/decorators/roles.decorator';

import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { AuthenticatedUser } from '../../../common/interfaces/request-with-user.interface';

@ApiTags('Job Vacancies')
@Controller('vacancies')
export class VacanciesController {
  constructor(private readonly vacanciesService: VacanciesService) { }

  @Public()
  @Get()
  async list(@Query() query: QueryVacancyDto) {
    const isPublic = !query.status && !query.all;
    const { data, meta } = await this.vacanciesService.list(query, isPublic);
    return { message: 'Daftar lowongan berhasil diambil.', data, meta };
  }

  @Public()
  @Get(':slugOrId')
  async findOne(@Param('slugOrId') slugOrId: string, @Query('all') all?: boolean) {
    const isPublic = !all;
    const data = await this.vacanciesService.findOne(slugOrId, isPublic);
    return { message: 'Detail lowongan ditemukan.', data };
  }

  @ApiBearerAuth()
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.EDITOR)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateVacancyDto, @CurrentUser() user: AuthenticatedUser) {
    const data = await this.vacanciesService.create(dto, user.role);
    return { message: 'Lowongan baru berhasil ditambahkan.', data };
  }

  @ApiBearerAuth()
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.EDITOR)
  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateVacancyDto, @CurrentUser() user: AuthenticatedUser) {
    const data = await this.vacanciesService.update(id, dto, user.role);
    return { message: 'Lowongan berhasil diperbarui.', data };
  }

  @ApiBearerAuth()
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.EDITOR)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.vacanciesService.remove(id);
    return { message: 'Lowongan berhasil dihapus.', data: null };
  }
}