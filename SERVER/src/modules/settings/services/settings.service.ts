import { Injectable } from '@nestjs/common';
import { SettingsRepository } from '../repositories/settings.repository';
import { UpdateHospitalSettingDto } from '../dto/update-hospital-setting.dto';
import { UpdateRegistrationSettingDto } from '../dto/update-registration-setting.dto';

@Injectable()
export class SettingsService {
  constructor(private readonly repo: SettingsRepository) {}

  async getHospitalSetting() {
    return this.repo.getHospitalSetting();
  }

  async updateHospitalSetting(dto: UpdateHospitalSettingDto) {
    return this.repo.updateHospitalSetting(dto);
  }

  async getRegistrationSetting() {
    return this.repo.getRegistrationSetting();
  }

  async updateRegistrationSetting(dto: UpdateRegistrationSettingDto) {
    return this.repo.updateRegistrationSetting(dto);
  }
}
