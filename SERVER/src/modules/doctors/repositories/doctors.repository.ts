import { Injectable } from '@nestjs/common';
import { Prisma, DoctorStatus } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';

export interface DoctorListFilter {
  specialty?: string;
  status?: DoctorStatus;
  search?: string;
  skip: number;
  take: number;
  orderBy: Record<string, 'asc' | 'desc'>;
}

@Injectable()
export class DoctorsRepository {
  constructor(private readonly prisma: PrismaService) {}

  private buildWhere(filter: Pick<DoctorListFilter, 'specialty' | 'status' | 'search'>): Prisma.DoctorWhereInput {
    return {
      ...(filter.specialty ? { specialty: filter.specialty } : {}),
      ...(filter.status ? { status: filter.status } : {}),
      ...(filter.search
        ? {
            OR: [
              { name: { contains: filter.search } },
              { subspecialty: { contains: filter.search } },
            ],
          }
        : {}),
    };
  }

  async findMany(filter: DoctorListFilter) {
    const where = this.buildWhere(filter);
    const [items, totalItems] = await this.prisma.$transaction([
      this.prisma.doctor.findMany({
        where,
        skip: filter.skip,
        take: filter.take,
        orderBy: filter.orderBy,
      }),
      this.prisma.doctor.count({ where }),
    ]);
    return { items, totalItems };
  }

  findBySlugOrId(slugOrId: string) {
    const isNumeric = /^\d+$/.test(slugOrId);
    return this.prisma.doctor.findFirst({
      where: isNumeric ? { OR: [{ id: BigInt(slugOrId) }, { slug: slugOrId }] } : { slug: slugOrId },
    });
  }

  findById(id: bigint) {
    return this.prisma.doctor.findUnique({ where: { id } });
  }

  findBySlug(slug: string) {
    return this.prisma.doctor.findUnique({ where: { slug } });
  }

  create(data: Prisma.DoctorCreateInput) {
    return this.prisma.doctor.create({ data });
  }

  update(id: bigint, data: Prisma.DoctorUpdateInput) {
    return this.prisma.doctor.update({ where: { id }, data });
  }

  delete(id: bigint) {
    return this.prisma.doctor.delete({ where: { id } });
  }
}
