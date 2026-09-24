import { Module } from '@nestjs/common';
import { VacanciesController } from './controllers/vacancies.controller';
import { VacanciesService } from './services/vacancies.service';
import { VacanciesRepository } from './repositories/vacancies.repository';

@Module({
  controllers: [VacanciesController],
  providers: [VacanciesService, VacanciesRepository],
  exports: [VacanciesService],
})
export class VacanciesModule {}
