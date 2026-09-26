import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { ServicesService } from '../services/services.service';
import { CreateServiceDto } from '../dto/create-service.dto';
import { UpdateServiceDto } from '../dto/update-service.dto';
import { QueryServiceDto } from '../dto/query-service.dto';
import { Public } from '../../../common/decorators/public.decorator';
import { Roles } from '../../../common/decorators/roles.decorator';

@ApiTags('Services')
@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Public()
  @Get()
  async list(@Query() query: QueryServiceDto) {
    const { data, meta } = await this.servicesService.list(query);
    return { message: 'Daftar layanan berhasil diambil.', data, meta };
  }

  @Public()
  @Get(':slugOrId')
  async findOne(@Param('slugOrId') slugOrId: string) {
    const data = await this.servicesService.findOne(slugOrId);
    return { message: 'Detail layanan ditemukan.', data };
  }

  @ApiBearerAuth()
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.EDITOR)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateServiceDto) {
    const data = await this.servicesService.create(dto);
    return { message: 'Layanan baru berhasil ditambahkan.', data };
  }

  @ApiBearerAuth()
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.EDITOR)
  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateServiceDto) {
    const data = await this.servicesService.update(id, dto);
    return { message: 'Data layanan berhasil diperbarui.', data };
  }

  @ApiBearerAuth()
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.EDITOR)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.servicesService.remove(id);
    return { message: 'Data layanan berhasil dihapus.', data: null };
  }
}
