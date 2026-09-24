import { Injectable } from '@nestjs/common';
import { Prisma, ServiceStatus } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';

export interface ServiceListFilter {
  category?: string;
  status?: ServiceStatus;
  search?: string;
  skip: number;
  take: number;
  orderBy: Record<string, 'asc' | 'desc'>;
}

@Injectable()
export class ServicesRepository {
  constructor(private readonly prisma: PrismaService) {}

  private buildWhere(filter: Pick<ServiceListFilter, 'category' | 'status' | 'search'>): Prisma.ServiceWhereInput {
    return {
      ...(filter.category ? { category: filter.category } : {}),
      ...(filter.status ? { status: filter.status } : {}),
      ...(filter.search
        ? { OR: [{ name: { contains: filter.search } }, { description: { contains: filter.search } }] }
        : {}),
    };
  }

  async findMany(filter: ServiceListFilter) {
    const where = this.buildWhere(filter);
    const [items, totalItems] = await this.prisma.$transaction([
      this.prisma.service.findMany({ where, skip: filter.skip, take: filter.take, orderBy: filter.orderBy }),
      this.prisma.service.count({ where }),
    ]);
    return { items, totalItems };
  }

  findBySlugOrId(slugOrId: string) {
    const isNumeric = /^\d+$/.test(slugOrId);
    return this.prisma.service.findFirst({
      where: isNumeric ? { OR: [{ id: BigInt(slugOrId) }, { slug: slugOrId }] } : { slug: slugOrId },
    });
  }

  findById(id: bigint) {
    return this.prisma.service.findUnique({ where: { id } });
  }

  findBySlug(slug: string) {
    return this.prisma.service.findUnique({ where: { slug } });
  }

  create(data: Prisma.ServiceCreateInput) {
    return this.prisma.service.create({ data });
  }

  update(id: bigint, data: Prisma.ServiceUpdateInput) {
    return this.prisma.service.update({ where: { id }, data });
  }

  delete(id: bigint) {
    return this.prisma.service.delete({ where: { id } });
  }
}
