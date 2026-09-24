import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { DoctorsService } from '../services/doctors.service';
import { CreateDoctorDto } from '../dto/create-doctor.dto';
import { UpdateDoctorDto } from '../dto/update-doctor.dto';
import { QueryDoctorDto } from '../dto/query-doctor.dto';
import { Public } from '../../../common/decorators/public.decorator';
import { Roles } from '../../../common/decorators/roles.decorator';

@ApiTags('Doctors')
@Controller('doctors')
export class DoctorsController {
  constructor(private readonly doctorsService: DoctorsService) {}

  @Public()
  @Get()
  async list(@Query() query: QueryDoctorDto) {
    const { data, meta } = await this.doctorsService.list(query);
    return { message: 'Daftar dokter berhasil diambil.', data, meta };
  }

  @Public()
  @Get(':slugOrId')
  async findOne(@Param('slugOrId') slugOrId: string) {
    const data = await this.doctorsService.findOne(slugOrId);
    return { message: 'Detail dokter ditemukan.', data };
  }

  @ApiBearerAuth()
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateDoctorDto) {
    const data = await this.doctorsService.create(dto);
    return { message: 'Dokter baru berhasil ditambahkan.', data };
  }

  @ApiBearerAuth()
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateDoctorDto) {
    const data = await this.doctorsService.update(id, dto);
    return { message: 'Data dokter berhasil diperbarui.', data };
  }

  @ApiBearerAuth()
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.doctorsService.remove(id);
    return { message: 'Data dokter berhasil dihapus.', data: null };
  }
}
