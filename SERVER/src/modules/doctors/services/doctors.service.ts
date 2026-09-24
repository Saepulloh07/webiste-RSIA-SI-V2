import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DoctorsRepository } from '../repositories/doctors.repository';
import { CreateDoctorDto } from '../dto/create-doctor.dto';
import { UpdateDoctorDto } from '../dto/update-doctor.dto';
import { QueryDoctorDto } from '../dto/query-doctor.dto';
import { buildPaginationMeta, paginationSkip, parseSort } from '../../../common/utils/pagination.util';
import { slugify, withUniqueSuffix } from '../../../common/utils/slugify';

const SORTABLE_FIELDS = ['name', 'specialty', 'createdAt', 'updatedAt'];

@Injectable()
export class DoctorsService {
  constructor(private readonly repo: DoctorsRepository) {}

  async list(query: QueryDoctorDto) {
    const limit = query.limit ?? 50; // doc default for this endpoint is 50, not the global 10
    const page = query.page ?? 1;
    const { items, totalItems } = await this.repo.findMany({
      specialty: query.specialty,
      status: query.status,
      search: query.search,
      skip: paginationSkip(page, limit),
      take: limit,
      orderBy: parseSort(query.sort, SORTABLE_FIELDS, { createdAt: 'desc' }),
    });
    return {
      data: items.map((d) => this.toResponse(d)),
      meta: buildPaginationMeta(page, limit, totalItems),
    };
  }

  async findOne(slugOrId: string) {
    const doctor = await this.repo.findBySlugOrId(slugOrId);
    if (!doctor) {
      throw new NotFoundException('Dokter tidak ditemukan.');
    }
    return this.toResponse(doctor);
  }

  async create(dto: CreateDoctorDto) {
    const slug = await this.generateUniqueSlug(dto.name);
    const doctor = await this.repo.create({
      name: dto.name,
      slug,
      specialty: dto.specialty,
      subspecialty: dto.subspecialty,
      status: dto.status,
      schedule: dto.schedule,
      sipNumber: dto.sipNumber,
      poliklinik: dto.poliklinik,
      imageUrl: dto.image,
      bio: dto.bio,
      education: dto.education as Prisma.InputJsonValue,
    });
    return {
      id: doctor.id.toString(),
      slug: doctor.slug,
      name: doctor.name,
      specialty: doctor.specialty,
    };
  }

  async update(id: string, dto: UpdateDoctorDto) {
    const existing = await this.repo.findById(BigInt(id));
    if (!existing) {
      throw new NotFoundException('Dokter tidak ditemukan.');
    }
    const doctor = await this.repo.update(BigInt(id), {
      ...(dto.name !== undefined ? { name: dto.name } : {}),
      ...(dto.specialty !== undefined ? { specialty: dto.specialty } : {}),
      ...(dto.subspecialty !== undefined ? { subspecialty: dto.subspecialty } : {}),
      ...(dto.status !== undefined ? { status: dto.status } : {}),
      ...(dto.schedule !== undefined ? { schedule: dto.schedule } : {}),
      ...(dto.sipNumber !== undefined ? { sipNumber: dto.sipNumber } : {}),
      ...(dto.poliklinik !== undefined ? { poliklinik: dto.poliklinik } : {}),
      ...(dto.image !== undefined ? { imageUrl: dto.image } : {}),
      ...(dto.bio !== undefined ? { bio: dto.bio } : {}),
      ...(dto.education !== undefined ? { education: dto.education as Prisma.InputJsonValue } : {}),
    });
    return this.toResponse(doctor);
  }

  async remove(id: string) {
    const existing = await this.repo.findById(BigInt(id));
    if (!existing) {
      throw new NotFoundException('Dokter tidak ditemukan.');
    }
    await this.repo.delete(BigInt(id));
  }

  private async generateUniqueSlug(name: string): Promise<string> {
    const base = slugify(name);
    let attempt = 0;
    // Guards against the unique constraint on `slug` for duplicate doctor names.
    while (true) {
      const candidate = withUniqueSuffix(base, attempt);
      const existing = await this.repo.findBySlug(candidate);
      if (!existing) return candidate;
      attempt += 1;
      if (attempt > 50) {
        throw new ConflictException('Tidak dapat membuat slug unik untuk dokter ini.');
      }
    }
  }

  private toResponse(doctor: NonNullable<Awaited<ReturnType<DoctorsRepository['findById']>>>) {
    return {
      id: doctor.id.toString(),
      name: doctor.name,
      slug: doctor.slug,
      specialty: doctor.specialty,
      subspecialty: doctor.subspecialty,
      status: doctor.status,
      schedule: doctor.schedule,
      sipNumber: doctor.sipNumber,
      poliklinik: doctor.poliklinik,
      image: doctor.imageUrl,
      bio: doctor.bio,
      education: doctor.education,
    };
  }
}
