import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { VacanciesRepository } from '../repositories/vacancies.repository';
import { CreateVacancyDto } from '../dto/create-vacancy.dto';
import { UpdateVacancyDto } from '../dto/update-vacancy.dto';
import { QueryVacancyDto } from '../dto/query-vacancy.dto';
import { buildPaginationMeta, paginationSkip, parseSort } from '../../../common/utils/pagination.util';
import { slugify, withUniqueSuffix } from '../../../common/utils/slugify';
import { VacancyStatus } from '@prisma/client';

const SORTABLE_FIELDS = ['title', 'department', 'deadline', 'createdAt', 'updatedAt'];

@Injectable()
export class VacanciesService {
  constructor(private readonly repo: VacanciesRepository) {}

  async list(query: QueryVacancyDto & { all?: boolean }, isPublic: boolean) {
    const limit = query.limit ?? 10;
    const page = query.page ?? 1;
    let status: VacancyStatus | undefined;
    if (query.status) {
      status = query.status;
    } else if (isPublic && !query.all) {
      status = VacancyStatus.PUBLISHED;
    }
    const { items, totalItems } = await this.repo.findMany({
      department: query.department,
      type: query.type,
      status,
      search: query.search,
      skip: paginationSkip(page, limit),
      take: limit,
      orderBy: parseSort(query.sort, SORTABLE_FIELDS, { createdAt: 'desc' }),
    });
    return { data: items.map((v) => this.toResponse(v)), meta: buildPaginationMeta(page, limit, totalItems) };
  }

  async findOne(slugOrId: string, isPublic: boolean) {
    const vacancy = await this.repo.findBySlugOrId(slugOrId);
    if (!vacancy || (isPublic && vacancy.status !== VacancyStatus.PUBLISHED)) {
      throw new NotFoundException('Lowongan tidak ditemukan.');
    }
    return this.toResponse(vacancy);
  }

  async create(dto: CreateVacancyDto) {
    const slug = await this.generateUniqueSlug(dto.title);
    const vacancy = await this.repo.create({
      title: dto.title,
      slug,
      department: dto.department,
      type: dto.type,
      location: dto.location,
      experience: dto.experience,
      deadline: dto.deadline ? new Date(dto.deadline) : undefined,
      status: dto.status,
      description: dto.description,
      requirements: dto.requirements,
      contactEmail: dto.contactEmail,
      contactWa: dto.contactWa,
      date: this.formatIndonesianDate(new Date()),
    });
    return { id: vacancy.id.toString(), slug: vacancy.slug, title: vacancy.title, status: vacancy.status };
  }

  async update(id: string, dto: UpdateVacancyDto) {
    const existing = await this.repo.findById(BigInt(id));
    if (!existing) throw new NotFoundException('Lowongan tidak ditemukan.');
    const vacancy = await this.repo.update(BigInt(id), {
      ...(dto.title !== undefined ? { title: dto.title } : {}),
      ...(dto.department !== undefined ? { department: dto.department } : {}),
      ...(dto.type !== undefined ? { type: dto.type } : {}),
      ...(dto.location !== undefined ? { location: dto.location } : {}),
      ...(dto.experience !== undefined ? { experience: dto.experience } : {}),
      ...(dto.deadline !== undefined ? { deadline: new Date(dto.deadline) } : {}),
      ...(dto.status !== undefined ? { status: dto.status } : {}),
      ...(dto.description !== undefined ? { description: dto.description } : {}),
      ...(dto.requirements !== undefined ? { requirements: dto.requirements } : {}),
      ...(dto.contactEmail !== undefined ? { contactEmail: dto.contactEmail } : {}),
      ...(dto.contactWa !== undefined ? { contactWa: dto.contactWa } : {}),
    });
    return this.toResponse(vacancy);
  }

  async remove(id: string) {
    const existing = await this.repo.findById(BigInt(id));
    if (!existing) throw new NotFoundException('Lowongan tidak ditemukan.');
    await this.repo.delete(BigInt(id));
  }

  private formatIndonesianDate(date: Date): string {
    return date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  private async generateUniqueSlug(title: string): Promise<string> {
    const base = slugify(title);
    let attempt = 0;
    while (true) {
      const candidate = withUniqueSuffix(base, attempt);
      const existing = await this.repo.findBySlug(candidate);
      if (!existing) return candidate;
      attempt += 1;
      if (attempt > 50) throw new ConflictException('Tidak dapat membuat slug unik untuk lowongan ini.');
    }
  }

  private toResponse(vacancy: NonNullable<Awaited<ReturnType<VacanciesRepository['findById']>>>) {
    const typeMap: Record<string, string> = {
      FULL_TIME: 'Full Time',
      PART_TIME: 'Part Time',
      KONTRAK: 'Kontrak',
    };
    const statusMap: Record<string, string> = {
      PUBLISHED: 'Published',
      DRAFT: 'Draft',
    };
    return {
      id: vacancy.id.toString(),
      title: vacancy.title,
      slug: vacancy.slug,
      department: vacancy.department,
      type: typeMap[vacancy.type] || vacancy.type,
      location: vacancy.location,
      experience: vacancy.experience,
      deadline: vacancy.deadline ? vacancy.deadline.toISOString().slice(0, 10) : null,
      status: statusMap[vacancy.status] || vacancy.status,
      description: vacancy.description,
      requirements: vacancy.requirements,
      contactEmail: vacancy.contactEmail,
      contactWa: vacancy.contactWa,
      date: vacancy.date,
    };
  }
}
