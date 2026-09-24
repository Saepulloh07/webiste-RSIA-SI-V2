import { Module } from '@nestjs/common';
import { DoctorsController } from './controllers/doctors.controller';
import { DoctorsService } from './services/doctors.service';
import { DoctorsRepository } from './repositories/doctors.repository';

@Module({
  controllers: [DoctorsController],
  providers: [DoctorsService, DoctorsRepository],
  exports: [DoctorsService],
})
export class DoctorsModule {}
