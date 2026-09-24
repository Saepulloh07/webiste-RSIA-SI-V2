import { Injectable } from '@nestjs/common';
import { SimrsService } from '../../../simrs/simrs.service';

@Injectable()
export class QueueRepository {
  constructor(private readonly simrs: SimrsService) {}

  async findTodayRegistrationByPhone(noTlp: string) {
    return this.simrs.safeQuery(async () => {
      const pasien = await this.simrs.pasien.findFirst({ where: { noTlp } });
      if (!pasien) return null;
      const start = new Date();
      start.setHours(0, 0, 0, 0);
      const end = new Date();
      end.setHours(23, 59, 59, 999);
      return this.simrs.regPeriksa.findFirst({
        where: { noRkmMedis: pasien.noRkmMedis, tglRegistrasi: { gte: start, lte: end } },
        orderBy: { jamReg: 'asc' },
      });
    }, 'findTodayRegistrationByPhone');
  }

  /** Position in today's queue for the same poliklinik, ordered by registration time. */
  async findQueuePosition(kdPoli: string, jamReg: Date) {
    return this.simrs.safeQuery(async () => {
      const start = new Date();
      start.setHours(0, 0, 0, 0);
      const end = new Date();
      end.setHours(23, 59, 59, 999);
      const aheadCount = await this.simrs.regPeriksa.count({
        where: {
          kdPoli,
          tglRegistrasi: { gte: start, lte: end },
          jamReg: { lt: jamReg },
          stts: { not: 'Batal' },
        },
      });
      return aheadCount + 1;
    }, 'findQueuePosition');
  }

  async listTodayQueueForPoli(kdPoli: string) {
    return this.simrs.safeQuery(async () => {
      const start = new Date();
      start.setHours(0, 0, 0, 0);
      const end = new Date();
      end.setHours(23, 59, 59, 999);
      return this.simrs.regPeriksa.findMany({
        where: { kdPoli, tglRegistrasi: { gte: start, lte: end } },
        orderBy: { jamReg: 'asc' },
      });
    }, 'listTodayQueueForPoli');
  }
}
