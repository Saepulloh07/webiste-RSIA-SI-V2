import { Injectable } from '@nestjs/common';
import { AdCampaignStatus, Prisma } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';

export interface AdListFilter {
  status?: AdCampaignStatus;
  search?: string;
  skip: number;
  take: number;
  orderBy: Record<string, 'asc' | 'desc'>;
}

@Injectable()
export class AdsRepository {
  constructor(private readonly prisma: PrismaService) {}

  private buildWhere(filter: Pick<AdListFilter, 'status' | 'search'>): Prisma.AdCampaignWhereInput {
    return {
      ...(filter.status ? { status: filter.status } : {}),
      ...(filter.search ? { OR: [{ title: { contains: filter.search } }] } : {}),
    };
  }

  async findMany(filter: AdListFilter) {
    const where = this.buildWhere(filter);
    const [items, totalItems] = await this.prisma.$transaction([
      this.prisma.adCampaign.findMany({ where, skip: filter.skip, take: filter.take, orderBy: filter.orderBy }),
      this.prisma.adCampaign.count({ where }),
    ]);
    return { items, totalItems };
  }

  findBySlugOrId(slugOrId: string) {
    const isNumeric = /^\d+$/.test(slugOrId);
    return this.prisma.adCampaign.findFirst({
      where: isNumeric ? { OR: [{ id: BigInt(slugOrId) }, { slug: slugOrId }] } : { slug: slugOrId },
    });
  }

  findById(id: bigint) {
    return this.prisma.adCampaign.findUnique({ where: { id } });
  }

  findBySlug(slug: string) {
    return this.prisma.adCampaign.findUnique({ where: { slug } });
  }

  create(data: Prisma.AdCampaignCreateInput) {
    return this.prisma.adCampaign.create({ data });
  }

  update(id: bigint, data: Prisma.AdCampaignUpdateInput) {
    return this.prisma.adCampaign.update({ where: { id }, data });
  }

  delete(id: bigint) {
    return this.prisma.adCampaign.delete({ where: { id } });
  }
}
