import {
  Injectable,
  InternalServerErrorException,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaClient } from '@sayangibu/simrs-client';

/**
 * Dedicated client for the SIMRS Khanza database — a separate server owned
 * by the hospital, not by this backend. See prisma/simrs/schema.prisma for
 * the read/introspect-only rules this connection must follow.
 *
 * Only booking_periksa is written to by this app (via the `bookingPeriksa`
 * model); every other model exposed on `this.client` (bookingRegistrasi,
 * regPeriksa, pasien, poliklinik, dokter) must only ever be queried with
 * find/findMany/findUnique from repository code — never create/update/delete.
 */
@Injectable()
export class SimrsService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(SimrsService.name);

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log('Connected to SIMRS Khanza database (external, read/introspect-only).');
    } catch (err) {
      // A SIMRS outage must not crash the whole CMS - public booking/queue
      // endpoints degrade gracefully with a 500 documented in Section 3.6,
      // but doctors/services/articles etc. must keep working.
      this.logger.error(
        'Could not connect to SIMRS_DATABASE_URL. Booking/queue endpoints will fail until this is resolved.',
        (err as Error)?.stack,
      );
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  /** Wraps a SIMRS query, converting infra failures into the documented 500 shape. */
  async safeQuery<T>(fn: () => Promise<T>, context: string): Promise<T> {
    try {
      return await fn();
    } catch (err) {
      this.logger.error(`SIMRS query failed [${context}]: ${(err as Error)?.message}`);
      throw new InternalServerErrorException('Kesalahan server internal atau kendala koneksi SIMRS.');
    }
  }
}
