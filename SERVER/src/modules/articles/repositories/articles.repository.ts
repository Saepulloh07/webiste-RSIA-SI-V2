import { Injectable } from '@nestjs/common';
import { Prisma, ArticleStatus } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';

export interface ArticleListFilter {
  category?: string;
  status?: ArticleStatus;
  search?: string;
  skip: number;
  take: number;
  orderBy: Record<string, 'asc' | 'desc'>;
}

@Injectable()
export class ArticlesRepository {
  constructor(private readonly prisma: PrismaService) {}

  private buildWhere(filter: Pick<ArticleListFilter, 'category' | 'status' | 'search'>): Prisma.ArticleWhereInput {
    return {
      ...(filter.category ? { category: filter.category } : {}),
      ...(filter.status ? { status: filter.status } : {}),
      ...(filter.search
        ? { OR: [{ title: { contains: filter.search } }, { content: { contains: filter.search } }] }
        : {}),
    };
  }

  async findMany(filter: ArticleListFilter) {
    const where = this.buildWhere(filter);
    const [items, totalItems] = await this.prisma.$transaction([
      this.prisma.article.findMany({ where, skip: filter.skip, take: filter.take, orderBy: filter.orderBy }),
      this.prisma.article.count({ where }),
    ]);
    return { items, totalItems };
  }

  findBySlugOrId(slugOrId: string) {
    const isNumeric = /^\d+$/.test(slugOrId);
    return this.prisma.article.findFirst({
      where: isNumeric ? { OR: [{ id: BigInt(slugOrId) }, { slug: slugOrId }] } : { slug: slugOrId },
    });
  }

  findById(id: bigint) {
    return this.prisma.article.findUnique({ where: { id } });
  }

  findBySlug(slug: string) {
    return this.prisma.article.findUnique({ where: { slug } });
  }

  create(data: Prisma.ArticleCreateInput) {
    return this.prisma.article.create({ data });
  }

  update(id: bigint, data: Prisma.ArticleUpdateInput) {
    return this.prisma.article.update({ where: { id }, data });
  }

  delete(id: bigint) {
    return this.prisma.article.delete({ where: { id } });
  }

  countByStatus(status: ArticleStatus) {
    return this.prisma.article.count({ where: { status } });
  }
}
