import { Body, Controller, Get, HttpCode, HttpStatus, Post, Query, Sse } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { Observable } from 'rxjs';
import { QueueService } from '../services/queue.service';
import { CheckQueueDto } from '../dto/check-queue.dto';
import { Public } from '../../../common/decorators/public.decorator';
import { SkipResponseWrap } from '../../../common/decorators/skip-response-wrap.decorator';

/**
 * Registered outside /api/v1 (paths: /api/queue/*), per Section 3.6's
 * endpoint list and the main.ts prefix-exclude configuration.
 */
@ApiTags('Queue (SIMRS)')
@Controller('api/queue')
export class QueueController {
  constructor(private readonly queueService: QueueService) {}

  @Public()
  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  @Post('check')
  @HttpCode(HttpStatus.OK)
  async check(@Body() dto: CheckQueueDto) {
    const data = await this.queueService.check(dto.noTelp);
    return { message: 'Nomor antrean ditemukan.', data };
  }

  @Public()
  @Get('my-queue')
  async myQueue(@Query('no_telp') noTelp: string) {
    const data = await this.queueService.myQueue(noTelp);
    return { message: 'Posisi antrean Anda saat ini.', data };
  }

  @Public()
  @SkipResponseWrap()
  @Sse('stream')
  stream(@Query('kd_poli') kdPoli: string): Observable<{ data: string }> {
    return this.queueService.streamQueue(kdPoli);
  }
}
