import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { promises as fs } from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { StorageProvider, UploadedFileResult, formatFileSize } from './storage.interface';

/** Default driver (STORAGE_DRIVER=local): saves under LOCAL_UPLOAD_DIR, served via /uploads/* in main.ts. */
@Injectable()
export class LocalStorageProvider implements StorageProvider {
  private readonly logger = new Logger(LocalStorageProvider.name);
  private readonly uploadDir: string;
  private readonly publicUrl: string;

  constructor(private readonly config: ConfigService) {
    this.uploadDir = this.config.get<string>('storage.localUploadDir') ?? './uploads';
    this.publicUrl = this.config.get<string>('storage.localPublicUrl') ?? 'http://localhost:5000/uploads';
  }

  async save(file: Express.Multer.File): Promise<UploadedFileResult> {
    await fs.mkdir(this.uploadDir, { recursive: true });
    const ext = path.extname(file.originalname);
    const filename = `${uuidv4()}${ext}`;
    await fs.writeFile(path.join(this.uploadDir, filename), file.buffer);
    return { url: `${this.publicUrl}/${filename}`, sizeLabel: formatFileSize(file.size) };
  }

  async delete(url: string): Promise<void> {
    try {
      const filename = url.split('/').pop();
      if (!filename) return;
      await fs.unlink(path.join(this.uploadDir, filename));
    } catch (err) {
      this.logger.warn(`Could not delete local file for ${url}: ${(err as Error).message}`);
    }
  }
}
