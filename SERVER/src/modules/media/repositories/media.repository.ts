import { Injectable } from '@nestjs/common';
import { MediaType, Prisma } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';

export interface MediaListFilter {
  type?: MediaType;
  search?: string;
  skip: number;
  take: number;
  orderBy: Record<string, 'asc' | 'desc'>;
}

@Injectable()
export class MediaRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findMany(filter: MediaListFilter) {
    const where: Prisma.MediaWhereInput = {
      ...(filter.type ? { type: filter.type } : {}),
      ...(filter.search ? { OR: [{ name: { contains: filter.search } }] } : {}),
    };
    const [items, totalItems] = await this.prisma.$transaction([
      this.prisma.media.findMany({ where, skip: filter.skip, take: filter.take, orderBy: filter.orderBy }),
      this.prisma.media.count({ where }),
    ]);
    return { items, totalItems };
  }

  findById(id: bigint) {
    return this.prisma.media.findUnique({ where: { id } });
  }

  create(data: Prisma.MediaCreateInput) {
    return this.prisma.media.create({ data });
  }

  delete(id: bigint) {
    return this.prisma.media.delete({ where: { id } });
  }
}
