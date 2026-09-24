import { Module } from '@nestjs/common';
import { BookingController } from './controllers/booking.controller';
import { AppointmentsHistoryController } from './controllers/appointments-history.controller';
import { BookingService } from './services/booking.service';
import { BookingRepository } from './repositories/booking.repository';

@Module({
  controllers: [BookingController, AppointmentsHistoryController],
  providers: [BookingService, BookingRepository],
  exports: [BookingRepository],
})
export class BookingModule {}
