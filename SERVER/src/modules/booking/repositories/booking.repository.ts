import { Injectable } from '@nestjs/common';
import { SimrsService } from '../../../simrs/simrs.service';

@Injectable()
export class BookingRepository {
  constructor(private readonly simrs: SimrsService) {}

  // --- poliklinik: SIMRS-owned, READ ONLY ---
  listActivePoliklinik() {
    return this.simrs.safeQuery(
      () => this.simrs.poliklinik.findMany({ where: { status: '1' }, orderBy: { nmPoli: 'asc' } }),
      'listActivePoliklinik',
    );
  }

  findPoliklinik(kdPoli: string) {
    return this.simrs.safeQuery(
      () => this.simrs.poliklinik.findUnique({ where: { kdPoli } }),
      'findPoliklinik',
    );
  }

  // --- booking_periksa: our bridge table, READ + WRITE ---
  createBooking(data: {
    noBooking: string;
    tanggal: Date;
    nama: string;
    alamat: string;
    noTelp: string;
    email?: string;
    kdPoli: string;
    tambahanPesan?: string;
  }) {
    return this.simrs.safeQuery(
      () =>
        this.simrs.bookingPeriksa.create({
          data: { ...data, status: 'Belum Dibalas', tanggalBooking: new Date() },
        }),
      'createBooking',
    );
  }

  findBookingByNumber(noBooking: string) {
    return this.simrs.safeQuery(
      () => this.simrs.bookingPeriksa.findUnique({ where: { noBooking } }),
      'findBookingByNumber',
    );
  }

  updateBookingStatus(noBooking: string, status: string) {
    return this.simrs.safeQuery(
      () => this.simrs.bookingPeriksa.update({ where: { noBooking }, data: { status } }),
      'updateBookingStatus',
    );
  }

  countBookingsForDate(date: Date) {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);
    return this.simrs.safeQuery(
      () => this.simrs.bookingPeriksa.count({ where: { tanggal: { gte: start, lte: end } } }),
      'countBookingsForDate',
    );
  }

  // --- reg_periksa / pasien: SIMRS-owned, READ ONLY (history & queue) ---
  findHistoryByPhone(noTlp: string) {
    return this.simrs.safeQuery(async () => {
      const pasien = await this.simrs.pasien.findFirst({ where: { noTlp } });
      if (!pasien) return [];
      return this.simrs.regPeriksa.findMany({
        where: { noRkmMedis: pasien.noRkmMedis },
        orderBy: { tglRegistrasi: 'desc' },
        take: 20,
      });
    }, 'findHistoryByPhone');
  }
}
