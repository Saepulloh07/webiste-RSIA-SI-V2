import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { AdsService } from '../services/ads.service';
import { CreateAdDto } from '../dto/create-ad.dto';
import { UpdateAdDto } from '../dto/update-ad.dto';
import { QueryAdDto } from '../dto/query-ad.dto';
import { Public } from '../../../common/decorators/public.decorator';
import { Roles } from '../../../common/decorators/roles.decorator';

import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { AuthenticatedUser } from '../../../common/interfaces/request-with-user.interface';

@ApiTags('Ads / Promo')
@Controller('ads')
export class AdsController {
  constructor(private readonly adsService: AdsService) {}

  @Public()
  @Get()
  async list(@Query() query: QueryAdDto) {
    const { data, meta } = await this.adsService.list(query);
    return { message: 'Daftar promo berhasil diambil.', data, meta };
  }

  @Public()
  @Get(':slugOrId')
  async findOne(@Param('slugOrId') slugOrId: string) {
    const data = await this.adsService.findOne(slugOrId);
    return { message: 'Detail promo ditemukan.', data };
  }

  @ApiBearerAuth()
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.EDITOR)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateAdDto, @CurrentUser() user: AuthenticatedUser) {
    const data = await this.adsService.create(dto, user.role);
    return { message: 'Promo baru berhasil ditambahkan.', data };
  }

  @ApiBearerAuth()
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.EDITOR)
  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateAdDto, @CurrentUser() user: AuthenticatedUser) {
    const data = await this.adsService.update(id, dto, user.role);
    return { message: 'Promo berhasil diperbarui.', data };
  }

  @ApiBearerAuth()
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.EDITOR)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.adsService.remove(id);
    return { message: 'Promo berhasil dihapus.', data: null };
  }
}
