import { Controller, Get } from '@nestjs/common';
import { Public } from '../common/decorators/public.decorator';
import { SkipResponseWrap } from '../common/decorators/skip-response-wrap.decorator';
import { PrismaService } from '../prisma/prisma.service';
import { SimrsService } from '../simrs/simrs.service';

@Controller('health')
export class HealthController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly simrs: SimrsService,
  ) {}

  @Public()
  @SkipResponseWrap()
  @Get()
  async check() {
    const [appDb, simrsDb] = await Promise.allSettled([
      this.prisma.$queryRaw`SELECT 1`,
      this.simrs.$queryRaw`SELECT 1`,
    ]);
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      services: {
        appDatabase: appDb.status === 'fulfilled' ? 'up' : 'down',
        simrsDatabase: simrsDb.status === 'fulfilled' ? 'up' : 'down',
      },
    };
  }
}
