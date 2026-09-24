import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';

/** Both settings tables are singletons: a single row with id=1, upserted on write. */
@Injectable()
export class SettingsRepository {
  constructor(private readonly prisma: PrismaService) {}

  getHospitalSetting() {
    return this.prisma.hospitalSetting.upsert({
      where: { id: 1 },
      update: {},
      create: { id: 1 },
    });
  }

  updateHospitalSetting(data: Prisma.HospitalSettingUpdateInput) {
    return this.prisma.hospitalSetting.upsert({
      where: { id: 1 },
      update: data,
      create: { id: 1, ...(data as Prisma.HospitalSettingCreateInput) },
    });
  }

  getRegistrationSetting() {
    return this.prisma.registrationSetting.upsert({
      where: { id: 1 },
      update: {},
      create: { id: 1 },
    });
  }

  updateRegistrationSetting(data: Prisma.RegistrationSettingUpdateInput) {
    return this.prisma.registrationSetting.upsert({
      where: { id: 1 },
      update: data,
      create: { id: 1, ...(data as Prisma.RegistrationSettingCreateInput) },
    });
  }
}
