import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { ServicesRepository } from '../repositories/services.repository';
import { CreateServiceDto } from '../dto/create-service.dto';
import { UpdateServiceDto } from '../dto/update-service.dto';
import { QueryServiceDto } from '../dto/query-service.dto';
import { buildPaginationMeta, paginationSkip, parseSort } from '../../../common/utils/pagination.util';
import { slugify, withUniqueSuffix } from '../../../common/utils/slugify';

const SORTABLE_FIELDS = ['name', 'category', 'createdAt', 'updatedAt'];

@Injectable()
export class ServicesService {
  constructor(private readonly repo: ServicesRepository) {}

  async list(query: QueryServiceDto) {
    const limit = query.limit ?? 10;
    const page = query.page ?? 1;
    const { items, totalItems } = await this.repo.findMany({
      category: query.category,
      status: query.status,
      search: query.search,
      skip: paginationSkip(page, limit),
      take: limit,
      orderBy: parseSort(query.sort, SORTABLE_FIELDS, { createdAt: 'desc' }),
    });
    return { data: items.map((s) => this.toResponse(s)), meta: buildPaginationMeta(page, limit, totalItems) };
  }

  async findOne(slugOrId: string) {
    const service = await this.repo.findBySlugOrId(slugOrId);
    if (!service) throw new NotFoundException('Layanan tidak ditemukan.');
    return this.toResponse(service);
  }

  async create(dto: CreateServiceDto) {
    const slug = await this.generateUniqueSlug(dto.name);
    const service = await this.repo.create({
      name: dto.name,
      slug,
      category: dto.category,
      status: dto.status,
      description: dto.description,
      imageUrl: dto.image,
      facilities: dto.facilities as Prisma.InputJsonValue,
      operationalHours: dto.operationalHours,
    });
    return this.toResponse(service);
  }

  async update(id: string, dto: UpdateServiceDto) {
    const existing = await this.repo.findById(BigInt(id));
    if (!existing) throw new NotFoundException('Layanan tidak ditemukan.');
    const service = await this.repo.update(BigInt(id), {
      ...(dto.name !== undefined ? { name: dto.name } : {}),
      ...(dto.category !== undefined ? { category: dto.category } : {}),
      ...(dto.status !== undefined ? { status: dto.status } : {}),
      ...(dto.description !== undefined ? { description: dto.description } : {}),
      ...(dto.image !== undefined ? { imageUrl: dto.image } : {}),
      ...(dto.facilities !== undefined ? { facilities: dto.facilities as Prisma.InputJsonValue } : {}),
      ...(dto.operationalHours !== undefined ? { operationalHours: dto.operationalHours } : {}),
    });
    return this.toResponse(service);
  }

  async remove(id: string) {
    const existing = await this.repo.findById(BigInt(id));
    if (!existing) throw new NotFoundException('Layanan tidak ditemukan.');
    await this.repo.delete(BigInt(id));
  }

  private async generateUniqueSlug(name: string): Promise<string> {
    const base = slugify(name);
    let attempt = 0;
    while (true) {
      const candidate = withUniqueSuffix(base, attempt);
      const existing = await this.repo.findBySlug(candidate);
      if (!existing) return candidate;
      attempt += 1;
      if (attempt > 50) throw new ConflictException('Tidak dapat membuat slug unik untuk layanan ini.');
    }
  }

  private toResponse(service: NonNullable<Awaited<ReturnType<ServicesRepository['findById']>>>) {
    const statusMap: Record<string, string> = {
      AKTIF: 'Aktif',
      NONAKTIF: 'Nonaktif',
    };
    return {
      id: service.id.toString(),
      name: service.name,
      slug: service.slug,
      category: service.category,
      status: statusMap[service.status] || service.status,
      description: service.description,
      image: service.imageUrl,
      operationalHours: service.operationalHours,
      facilities: service.facilities,
    };
  }
}
