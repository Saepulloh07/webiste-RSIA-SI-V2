import { Body, Controller, Get, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { SettingsService } from '../services/settings.service';
import { UpdateHospitalSettingDto } from '../dto/update-hospital-setting.dto';
import { UpdateRegistrationSettingDto } from '../dto/update-registration-setting.dto';
import { Public } from '../../../common/decorators/public.decorator';
import { Roles } from '../../../common/decorators/roles.decorator';

@ApiTags('Settings')
@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Public()
  @Get()
  async getHospitalSetting() {
    const data = await this.settingsService.getHospitalSetting();
    return { message: 'Pengaturan rumah sakit berhasil diambil.', data };
  }

  @ApiBearerAuth()
  @Roles(UserRole.SUPER_ADMIN)
  @Put()
  async updateHospitalSetting(@Body() dto: UpdateHospitalSettingDto) {
    const data = await this.settingsService.updateHospitalSetting(dto);
    return { message: 'Pengaturan rumah sakit berhasil diperbarui.', data };
  }

  @Public()
  @Get('registration')
  async getRegistrationSetting() {
    const data = await this.settingsService.getRegistrationSetting();
    return { message: 'Pengaturan pendaftaran berhasil diambil.', data };
  }

  @ApiBearerAuth()
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @Put('registration')
  async updateRegistrationSetting(@Body() dto: UpdateRegistrationSettingDto) {
    const data = await this.settingsService.updateRegistrationSetting(dto);
    return { message: 'Pengaturan pendaftaran berhasil diperbarui.', data };
  }
}
