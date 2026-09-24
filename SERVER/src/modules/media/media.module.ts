import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { MediaController } from './controllers/media.controller';
import { MediaService } from './services/media.service';
import { MediaRepository } from './repositories/media.repository';
import { STORAGE_PROVIDER } from './storage/storage.interface';
import { LocalStorageProvider } from './storage/local-storage.provider';
import { S3StorageProvider } from './storage/s3-storage.provider';

@Module({
  imports: [
    MulterModule.register({
      // Buffer in memory; the storage provider decides where it ends up (disk/S3).
      storage: undefined,
    }),
  ],
  controllers: [MediaController],
  providers: [
    MediaService,
    MediaRepository,
    LocalStorageProvider,
    S3StorageProvider,
    {
      provide: STORAGE_PROVIDER,
      useFactory: (config: ConfigService, local: LocalStorageProvider, s3: S3StorageProvider) =>
        config.get<string>('storage.driver') === 's3' ? s3 : local,
      inject: [ConfigService, LocalStorageProvider, S3StorageProvider],
    },
  ],
})
export class MediaModule {}
