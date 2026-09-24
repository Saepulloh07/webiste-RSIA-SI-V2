import { Module } from '@nestjs/common';
import { QueueController } from './controllers/queue.controller';
import { QueueService } from './services/queue.service';
import { QueueRepository } from './repositories/queue.repository';

@Module({
  controllers: [QueueController],
  providers: [QueueService, QueueRepository],
})
export class QueueModule {}
