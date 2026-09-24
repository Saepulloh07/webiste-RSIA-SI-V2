import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { BookingRepository } from '../repositories/booking.repository';
import { RegisterBookingDto } from '../dto/register-booking.dto';
import { CheckBookingDto } from '../dto/check-booking.dto';
import { UpdateBookingStatusDto } from '../dto/update-booking-status.dto';

@Injectable()
export class BookingService {
  constructor(private readonly repo: BookingRepository) {}

  async listPoliklinik() {
    const list = await this.repo.listActivePoliklinik();
    return list.map((p) => ({ kdPoli: p.kdPoli, nmPoli: p.nmPoli }));
  }

  async register(dto: RegisterBookingDto) {
    const poli = await this.repo.findPoliklinik(dto.kdPoli);
    if (!poli || poli.status !== '1') {
      throw new BadRequestException('Poliklinik yang dipilih tidak tersedia.');
    }

    const noBooking = await this.generateBookingNumber(new Date(dto.tanggal));
    const booking = await this.repo.createBooking({
      noBooking,
      tanggal: new Date(dto.tanggal),
      nama: dto.nama,
      alamat: dto.alamat,
      noTelp: dto.noTelp,
      email: dto.email,
      kdPoli: dto.kdPoli,
      tambahanPesan: dto.tambahanPesan,
    });

    return {
      noBooking: booking.noBooking,
      status: booking.status,
      tanggal: booking.tanggal.toISOString().slice(0, 10),
      kdPoli: booking.kdPoli,
      nmPoli: poli.nmPoli,
    };
  }

  async check(dto: CheckBookingDto) {
    const booking = await this.repo.findBookingByNumber(dto.noBooking);
    if (!booking) {
      throw new NotFoundException('Nomor booking tidak ditemukan.');
    }
    return {
      noBooking: booking.noBooking,
      nama: booking.nama,
      kdPoli: booking.kdPoli,
      tanggal: booking.tanggal.toISOString().slice(0, 10),
      status: booking.status,
    };
  }

  async updateStatus(dto: UpdateBookingStatusDto) {
    const existing = await this.repo.findBookingByNumber(dto.noBooking);
    if (!existing) {
      throw new NotFoundException('Nomor booking tidak ditemukan.');
    }
    const updated = await this.repo.updateBookingStatus(dto.noBooking, dto.status);
    return { noBooking: updated.noBooking, status: updated.status };
  }

  async history(noTelp: string) {
    if (!noTelp) {
      throw new BadRequestException('Parameter no_telp wajib disertakan.');
    }
    const rows = await this.repo.findHistoryByPhone(noTelp);
    return rows.map((r) => ({
      noRawat: r.noRawat,
      tglRegistrasi: r.tglRegistrasi.toISOString().slice(0, 10),
      kdPoli: r.kdPoli,
      kdDokter: r.kdDokter,
      statusLanjut: r.statusLanjut,
      statusBayar: r.statusBayar,
    }));
  }

  /** Format documented in Section 3.6: BP{YYYYMMDD}{4-digit sequence}. */
  private async generateBookingNumber(date: Date): Promise<string> {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    const countToday = await this.repo.countBookingsForDate(date);
    const seq = String(countToday + 1).padStart(4, '0');
    return `BP${y}${m}${d}${seq}`;
  }
}
