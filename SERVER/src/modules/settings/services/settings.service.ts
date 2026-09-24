import { Injectable } from '@nestjs/common';
import { SettingsRepository } from '../repositories/settings.repository';
import { UpdateHospitalSettingDto } from '../dto/update-hospital-setting.dto';
import { UpdateRegistrationSettingDto } from '../dto/update-registration-setting.dto';

@Injectable()
export class SettingsService {
  constructor(private readonly repo: SettingsRepository) { }

  async getHospitalSetting() {
    const setting = await this.repo.getHospitalSetting();
    return this.toHospitalResponse(setting);
  }

  async updateHospitalSetting(dto: UpdateHospitalSettingDto) {
    const setting = await this.repo.updateHospitalSetting(dto);
    return this.toHospitalResponse(setting);
  }

  async getRegistrationSetting() {
    const setting = await this.repo.getRegistrationSetting();
    return this.toRegistrationResponse(setting);
  }

  async updateRegistrationSetting(dto: UpdateRegistrationSettingDto) {
    const setting = await this.repo.updateRegistrationSetting(dto);
    return this.toRegistrationResponse(setting);
  }

  /**
   * Membuang field internal (id, updatedAt) yang tidak boleh dikirim balik oleh
   * frontend, dan mengubah kolom nullable menjadi string kosong supaya aman
   * dipakai sebagai `value` pada controlled <input> di React (null akan memicu
   * warning "value prop on input should not be null").
   */
  private toHospitalResponse(setting: {
    hospitalName: string;
    slogan: string | null;
    aboutText: string | null;
    operationalHours: string | null;
    logoUrl: string | null;
    phoneCs: string | null;
    phoneEmergency: string | null;
    whatsapp: string | null;
    email: string | null;
    address: string | null;
    mapsUrl: string | null;
    mapsEmbed: string | null;
    instagram: string | null;
    facebook: string | null;
    youtube: string | null;
    tiktok: string | null;
  }) {
    return {
      hospitalName: setting.hospitalName ?? '',
      slogan: setting.slogan ?? '',
      aboutText: setting.aboutText ?? '',
      operationalHours: setting.operationalHours ?? '',
      logoUrl: setting.logoUrl ?? '',
      phoneCs: setting.phoneCs ?? '',
      phoneEmergency: setting.phoneEmergency ?? '',
      whatsapp: setting.whatsapp ?? '',
      email: setting.email ?? '',
      address: setting.address ?? '',
      mapsUrl: setting.mapsUrl ?? '',
      mapsEmbed: setting.mapsEmbed ?? '',
      instagram: setting.instagram ?? '',
      facebook: setting.facebook ?? '',
      youtube: setting.youtube ?? '',
      tiktok: setting.tiktok ?? '',
    };
  }

  private toRegistrationResponse(setting: {
    isOpen: boolean;
    maxDailyQuota: number;
    noticeMessage: string | null;
  }) {
    return {
      isOpen: setting.isOpen,
      maxDailyQuota: setting.maxDailyQuota,
      noticeMessage: setting.noticeMessage ?? '',
    };
  }
}