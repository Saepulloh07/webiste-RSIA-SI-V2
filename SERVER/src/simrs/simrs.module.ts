import { Global, Module } from '@nestjs/common';
import { SimrsService } from './simrs.service';

@Global()
@Module({
  providers: [SimrsService],
  exports: [SimrsService],
})
export class SimrsModule {}
