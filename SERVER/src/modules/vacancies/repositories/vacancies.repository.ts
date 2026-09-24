import { Injectable } from '@nestjs/common';
import { Prisma, VacancyStatus, VacancyType } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';

export interface VacancyListFilter {
  department?: string;
  type?: VacancyType;
  status?: VacancyStatus;
  search?: string;
  skip: number;
  take: number;
  orderBy: Record<string, 'asc' | 'desc'>;
}

@Injectable()
export class VacanciesRepository {
  constructor(private readonly prisma: PrismaService) {}

  private buildWhere(
    filter: Pick<VacancyListFilter, 'department' | 'type' | 'status' | 'search'>,
  ): Prisma.JobVacancyWhereInput {
    return {
      ...(filter.department ? { department: filter.department } : {}),
      ...(filter.type ? { type: filter.type } : {}),
      ...(filter.status ? { status: filter.status } : {}),
      ...(filter.search ? { OR: [{ title: { contains: filter.search } }] } : {}),
    };
  }

  async findMany(filter: VacancyListFilter) {
    const where = this.buildWhere(filter);
    const [items, totalItems] = await this.prisma.$transaction([
      this.prisma.jobVacancy.findMany({ where, skip: filter.skip, take: filter.take, orderBy: filter.orderBy }),
      this.prisma.jobVacancy.count({ where }),
    ]);
    return { items, totalItems };
  }

  findBySlugOrId(slugOrId: string) {
    const isNumeric = /^\d+$/.test(slugOrId);
    return this.prisma.jobVacancy.findFirst({
      where: isNumeric ? { OR: [{ id: BigInt(slugOrId) }, { slug: slugOrId }] } : { slug: slugOrId },
    });
  }

  findById(id: bigint) {
    return this.prisma.jobVacancy.findUnique({ where: { id } });
  }

  findBySlug(slug: string) {
    return this.prisma.jobVacancy.findUnique({ where: { slug } });
  }

  create(data: Prisma.JobVacancyCreateInput) {
    return this.prisma.jobVacancy.create({ data });
  }

  update(id: bigint, data: Prisma.JobVacancyUpdateInput) {
    return this.prisma.jobVacancy.update({ where: { id }, data });
  }

  delete(id: bigint) {
    return this.prisma.jobVacancy.delete({ where: { id } });
  }
}
