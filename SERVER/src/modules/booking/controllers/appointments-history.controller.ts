import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BookingService } from '../services/booking.service';
import { Public } from '../../../common/decorators/public.decorator';

/**
 * Registered outside the /api/v1 prefix (path: /api/appointments/history),
 * per Section 3.6's endpoint list. Kept in its own controller since the
 * base path differs from the rest of the booking group.
 */
@ApiTags('Booking (SIMRS)')
@Controller('api/appointments')
export class AppointmentsHistoryController {
  constructor(private readonly bookingService: BookingService) {}

  @Public()
  @Get('history')
  async history(@Query('no_telp') noTelp: string) {
    const data = await this.bookingService.history(noTelp);
    return { message: 'Riwayat kunjungan berhasil diambil.', data };
  }
}
