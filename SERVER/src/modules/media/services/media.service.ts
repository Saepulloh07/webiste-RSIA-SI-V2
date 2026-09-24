import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MediaType } from '@prisma/client';
import { MediaRepository } from '../repositories/media.repository';
import { QueryMediaDto } from '../dto/query-media.dto';
import { UploadMediaDto } from '../dto/upload-media.dto';
import { STORAGE_PROVIDER, StorageProvider } from '../storage/storage.interface';
import { buildPaginationMeta, paginationSkip, parseSort } from '../../../common/utils/pagination.util';

const SORTABLE_FIELDS = ['name', 'createdAt'];
const ALLOWED_MIME_PREFIXES = ['image/', 'video/', 'application/pdf'];

@Injectable()
export class MediaService {
  constructor(
    private readonly repo: MediaRepository,
    private readonly config: ConfigService,
    @Inject(STORAGE_PROVIDER) private readonly storage: StorageProvider,
  ) {}

  async list(query: QueryMediaDto) {
    const limit = query.limit ?? 20;
    const page = query.page ?? 1;
    const { items, totalItems } = await this.repo.findMany({
      type: query.type,
      search: query.search,
      skip: paginationSkip(page, limit),
      take: limit,
      orderBy: parseSort(query.sort, SORTABLE_FIELDS, { createdAt: 'desc' }),
    });
    return { data: items.map((m) => this.toResponse(m)), meta: buildPaginationMeta(page, limit, totalItems) };
  }

  async upload(file: Express.Multer.File | undefined, dto: UploadMediaDto) {
    if (!file) {
      throw new BadRequestException('File wajib diunggah.');
    }
    this.assertMimeAllowed(file.mimetype);
    this.assertSizeAllowed(file.size);

    const { url, sizeLabel } = await this.storage.save(file);
    const media = await this.repo.create({
      name: file.originalname,
      type: dto.type ?? MediaType.IMAGE,
      url,
      size: sizeLabel,
      date: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }),
      description: dto.description,
    });
    return this.toResponse(media);
  }

  async remove(id: string) {
    const existing = await this.repo.findById(BigInt(id));
    if (!existing) throw new NotFoundException('Media tidak ditemukan.');
    await this.storage.delete(existing.url);
    await this.repo.delete(BigInt(id));
  }

  private assertMimeAllowed(mimetype: string) {
    const allowed = ALLOWED_MIME_PREFIXES.some((p) => mimetype.startsWith(p));
    if (!allowed) {
      throw new BadRequestException(
        'Tipe file tidak didukung. Hanya gambar, video, atau dokumen PDF yang diizinkan.',
      );
    }
  }

  private assertSizeAllowed(sizeBytes: number) {
    const maxMb = this.config.get<number>('storage.maxSizeMb') ?? 5;
    if (sizeBytes > maxMb * 1024 * 1024) {
      throw new BadRequestException(`Ukuran file melebihi batas maksimum ${maxMb}MB.`);
    }
  }

  private toResponse(media: NonNullable<Awaited<ReturnType<MediaRepository['findById']>>>) {
    return {
      id: media.id.toString(),
      name: media.name,
      type: media.type.toLowerCase(),
      url: media.url,
      size: media.size,
      date: media.date,
      description: media.description,
    };
  }
}
