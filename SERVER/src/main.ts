import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { RequestMethod, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import * as express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: false });
  const config = app.get(ConfigService);

  const apiPrefix = config.get<string>('app.apiPrefix') ?? 'api/v1';
  app.setGlobalPrefix(apiPrefix, {
    exclude: [
      { path: 'api/queue/check', method: RequestMethod.POST },
      { path: 'api/queue/my-queue', method: RequestMethod.GET },
      { path: 'api/queue/stream', method: RequestMethod.GET },
      { path: 'api/appointments/history', method: RequestMethod.GET },
      { path: 'health', method: RequestMethod.GET },
    ],
  });

  // Security headers (Helmet). crossOriginResourcePolicy 'cross-origin' agar
  // gambar di /uploads/* tetap bisa dimuat dari origin frontend yang berbeda
  // port/domain (dulu ini yang bikin ERR_BLOCKED_BY_RESPONSE.NotSameOrigin).
  app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));

  // CORS whitelist per documentation.
  const origins = (config.get<string>('app.corsOrigins') ?? '')
    .split(',')
    .map((o: string) => o.trim())
    .filter(Boolean);
  app.enableCors({
    origin: origins.length ? origins : true,
    credentials: true,
  });

  app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
    const existing = req.header('X-Request-ID');
    const requestId = existing && existing.length > 0 ? existing : uuidv4();
    (req as any).requestId = requestId;
    res.setHeader('X-Request-ID', requestId);
    next();
  });

  app.use('/uploads', express.static(config.get<string>('storage.localUploadDir') ?? './uploads'));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new ResponseInterceptor());

  if (config.get<string>('app.nodeEnv') !== 'production') {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('RSIA Sayang Ibu Batusangkar — Website & CMS API')
      .setDescription('REST API v1.0.0 — see API_DOCUMENTATION.txt for the authoritative contract')
      .setVersion('1.0.0')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('docs', app, document);
  }

  const port = config.get<number>('app.port') ?? 5000;
  await app.listen(port);
  console.log(`🚀 Server ready on http://localhost:${port}/${apiPrefix}`);
}

bootstrap();