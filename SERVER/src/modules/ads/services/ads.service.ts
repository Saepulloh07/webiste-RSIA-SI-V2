import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { AdsRepository } from '../repositories/ads.repository';
import { CreateAdDto } from '../dto/create-ad.dto';
import { UpdateAdDto } from '../dto/update-ad.dto';
import { QueryAdDto } from '../dto/query-ad.dto';
import { buildPaginationMeta, paginationSkip, parseSort } from '../../../common/utils/pagination.util';
import { slugify, withUniqueSuffix } from '../../../common/utils/slugify';

const SORTABLE_FIELDS = ['title', 'startDate', 'endDate', 'createdAt', 'updatedAt'];

@Injectable()
export class AdsService {
  constructor(private readonly repo: AdsRepository) {}

  async list(query: QueryAdDto) {
    const limit = query.limit ?? 10;
    const page = query.page ?? 1;
    const { items, totalItems } = await this.repo.findMany({
      status: query.status,
      search: query.search,
      skip: paginationSkip(page, limit),
      take: limit,
      orderBy: parseSort(query.sort, SORTABLE_FIELDS, { createdAt: 'desc' }),
    });
    return { data: items.map((a) => this.toResponse(a)), meta: buildPaginationMeta(page, limit, totalItems) };
  }

  async findOne(slugOrId: string) {
    const ad = await this.repo.findBySlugOrId(slugOrId);
    if (!ad) throw new NotFoundException('Promo tidak ditemukan.');
    return this.toResponse(ad);
  }

  async create(dto: CreateAdDto) {
    this.assertDateRange(dto.startDate, dto.endDate);
    const slug = await this.generateUniqueSlug(dto.title);
    const ad = await this.repo.create({
      title: dto.title,
      slug,
      badge: dto.badge,
      price: dto.price,
      originalPrice: dto.originalPrice,
      startDate: new Date(dto.startDate),
      endDate: new Date(dto.endDate),
      status: dto.status,
      content: dto.content,
      imageUrl: dto.image,
      highlights: dto.highlights as Prisma.InputJsonValue,
      targetKeywords: dto.targetKeywords,
      contactWa: dto.contactWa,
    });
    return this.toResponse(ad);
  }

  async update(id: string, dto: UpdateAdDto) {
    const existing = await this.repo.findById(BigInt(id));
    if (!existing) throw new NotFoundException('Promo tidak ditemukan.');
    if (dto.startDate || dto.endDate) {
      this.assertDateRange(
        dto.startDate ?? existing.startDate.toISOString(),
        dto.endDate ?? existing.endDate.toISOString(),
      );
    }
    const ad = await this.repo.update(BigInt(id), {
      ...(dto.title !== undefined ? { title: dto.title } : {}),
      ...(dto.badge !== undefined ? { badge: dto.badge } : {}),
      ...(dto.price !== undefined ? { price: dto.price } : {}),
      ...(dto.originalPrice !== undefined ? { originalPrice: dto.originalPrice } : {}),
      ...(dto.startDate !== undefined ? { startDate: new Date(dto.startDate) } : {}),
      ...(dto.endDate !== undefined ? { endDate: new Date(dto.endDate) } : {}),
      ...(dto.status !== undefined ? { status: dto.status } : {}),
      ...(dto.content !== undefined ? { content: dto.content } : {}),
      ...(dto.image !== undefined ? { imageUrl: dto.image } : {}),
      ...(dto.highlights !== undefined ? { highlights: dto.highlights as Prisma.InputJsonValue } : {}),
      ...(dto.targetKeywords !== undefined ? { targetKeywords: dto.targetKeywords } : {}),
      ...(dto.contactWa !== undefined ? { contactWa: dto.contactWa } : {}),
    });
    return this.toResponse(ad);
  }

  async remove(id: string) {
    const existing = await this.repo.findById(BigInt(id));
    if (!existing) throw new NotFoundException('Promo tidak ditemukan.');
    await this.repo.delete(BigInt(id));
  }

  private assertDateRange(start: string, end: string) {
    if (new Date(start).getTime() > new Date(end).getTime()) {
      throw new BadRequestException('startDate tidak boleh setelah endDate.');
    }
  }

  private async generateUniqueSlug(title: string): Promise<string> {
    const base = slugify(title);
    let attempt = 0;
    while (true) {
      const candidate = withUniqueSuffix(base, attempt);
      const existing = await this.repo.findBySlug(candidate);
      if (!existing) return candidate;
      attempt += 1;
      if (attempt > 50) throw new ConflictException('Tidak dapat membuat slug unik untuk promo ini.');
    }
  }

  private toResponse(ad: NonNullable<Awaited<ReturnType<AdsRepository['findById']>>>) {
    const statusMap: Record<string, string> = {
      AKTIF: 'Aktif',
      BERAKHIR: 'Berakhir',
      DRAFT: 'Draft',
    };
    return {
      id: ad.id.toString(),
      title: ad.title,
      slug: ad.slug,
      badge: ad.badge,
      price: ad.price,
      originalPrice: ad.originalPrice,
      startDate: ad.startDate.toISOString().slice(0, 10),
      endDate: ad.endDate.toISOString().slice(0, 10),
      status: statusMap[ad.status] || ad.status,
      content: ad.content,
      image: ad.imageUrl,
      highlights: ad.highlights,
      targetKeywords: ad.targetKeywords,
      contactWa: ad.contactWa,
    };
  }
}
