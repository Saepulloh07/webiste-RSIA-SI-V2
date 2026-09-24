import { Injectable, NotFoundException } from '@nestjs/common';
import { Observable, interval, switchMap, startWith, catchError, of } from 'rxjs';
import { QueueRepository } from '../repositories/queue.repository';

@Injectable()
export class QueueService {
  constructor(private readonly repo: QueueRepository) {}

  async check(noTlp: string) {
    const reg = await this.repo.findTodayRegistrationByPhone(noTlp);
    if (!reg) {
      throw new NotFoundException('Tidak ditemukan pendaftaran aktif untuk nomor telepon ini hari ini.');
    }
    const position = await this.repo.findQueuePosition(reg.kdPoli, reg.jamReg);
    return {
      noRawat: reg.noRawat,
      kdPoli: reg.kdPoli,
      status: reg.stts,
      queuePosition: position,
    };
  }

  async myQueue(noTlp: string) {
    return this.check(noTlp);
  }

  /**
   * Server-Sent Events stream for GET /api/queue/stream. Polls SIMRS every
   * 5s and pushes the current queue snapshot for the given poliklinik.
   * [UNRESOLVED]: doc doesn't specify polling interval or exact payload
   * shape for the live stream - 5s is a reasonable default, adjust freely.
   */
  streamQueue(kdPoli: string): Observable<{ data: string }> {
    return interval(5000).pipe(
      startWith(0),
      switchMap(() => this.repo.listTodayQueueForPoli(kdPoli)),
      switchMap((rows) =>
        of({
          data: JSON.stringify({
            kdPoli,
            totalToday: rows.length,
            waiting: rows.filter((r) => r.stts === 'Belum').length,
            updatedAt: new Date().toISOString(),
          }),
        }),
      ),
      catchError(() =>
        of({ data: JSON.stringify({ error: 'Koneksi SIMRS terputus, mencoba kembali...' }) }),
      ),
    );
  }
}
