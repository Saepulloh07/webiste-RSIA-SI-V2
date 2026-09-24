import { Module } from '@nestjs/common';
import { AdsController } from './controllers/ads.controller';
import { AdsService } from './services/ads.service';
import { AdsRepository } from './repositories/ads.repository';

@Module({
  controllers: [AdsController],
  providers: [AdsService, AdsRepository],
  exports: [AdsService],
})
export class AdsModule {}
