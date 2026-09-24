import { Body, Controller, Get, HttpCode, HttpStatus, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { UserRole } from '@prisma/client';
import { BookingService } from '../services/booking.service';
import { RegisterBookingDto } from '../dto/register-booking.dto';
import { CheckBookingDto } from '../dto/check-booking.dto';
import { UpdateBookingStatusDto } from '../dto/update-booking-status.dto';
import { Public } from '../../../common/decorators/public.decorator';
import { Roles } from '../../../common/decorators/roles.decorator';

// NOTE: these routes are excluded from the /api/v1 prefix rewrite where the
// doc shows them bare (see main.ts setGlobalPrefix exclude list) except
// /api/v1/poliklinik, /api/v1/register, /api/v1/check, /api/v1/update-status
// which DO carry the v1 prefix per Section 3.6 - only the queue/history
// group does not. Controller path below is relative to that prefix.
@ApiTags('Booking (SIMRS)')
@Controller()
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Public()
  @Get('poliklinik')
  async listPoliklinik() {
    const data = await this.bookingService.listPoliklinik();
    return { message: 'Daftar poliklinik berhasil diambil.', data };
  }

  @Public()
  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() dto: RegisterBookingDto) {
    const data = await this.bookingService.register(dto);
    return { message: 'Pendaftaran online berhasil dikirim. Menunggu konfirmasi petugas.', data };
  }

  @Public()
  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  @Post('check')
  @HttpCode(HttpStatus.OK)
  async check(@Body() dto: CheckBookingDto) {
    const data = await this.bookingService.check(dto);
    return { message: 'Status booking ditemukan.', data };
  }

  @ApiBearerAuth()
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @Post('update-status')
  @HttpCode(HttpStatus.OK)
  async updateStatus(@Body() dto: UpdateBookingStatusDto) {
    const data = await this.bookingService.updateStatus(dto);
    return { message: 'Status booking berhasil diperbarui.', data };
  }
}
