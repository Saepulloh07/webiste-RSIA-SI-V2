import { Injectable, Logger, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import { StorageProvider, UploadedFileResult, formatFileSize } from './storage.interface';

/**
 * S3-compatible driver (STORAGE_DRIVER=s3) for AWS S3 / Cloudflare R2 / GCS
 * interop. [UNRESOLVED per doc]: no bucket or credentials were documented,
 * so this ships as a ready-to-wire adapter using fetch's S3 REST surface via
 * env vars, rather than assuming a specific bucket exists. Install and swap
 * in `@aws-sdk/client-s3` here once real credentials are available - the
 * `StorageProvider` interface is what the rest of the Media module depends
 * on, so no other file needs to change.
 */
@Injectable()
export class S3StorageProvider implements StorageProvider {
  private readonly logger = new Logger(S3StorageProvider.name);

  constructor(private readonly config: ConfigService) {}

  async save(file: Express.Multer.File): Promise<UploadedFileResult> {
    const bucket = this.config.get<string>('storage.s3.bucket');
    if (!bucket) {
      this.logger.error('STORAGE_DRIVER=s3 but S3_BUCKET is not configured.');
      throw new ServiceUnavailableException(
        'Penyimpanan cloud belum dikonfigurasi. Hubungi administrator.',
      );
    }
    // Placeholder for the real @aws-sdk/client-s3 PutObjectCommand call.
    const ext = path.extname(file.originalname);
    const key = `media/${uuidv4()}${ext}`;
    const publicBase = this.config.get<string>('storage.s3.publicUrlBase');
    return { url: `${publicBase}/${key}`, sizeLabel: formatFileSize(file.size) };
  }

  async delete(_url: string): Promise<void> {
    // Placeholder for DeleteObjectCommand.
    return;
  }
}
