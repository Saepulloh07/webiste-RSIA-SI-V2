import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { ArticleStatus, Prisma, UserRole } from '@prisma/client';
import { ArticlesRepository } from '../repositories/articles.repository';
import { CreateArticleDto } from '../dto/create-article.dto';
import { UpdateArticleDto } from '../dto/update-article.dto';
import { QueryArticleDto } from '../dto/query-article.dto';
import { buildPaginationMeta, paginationSkip, parseSort } from '../../../common/utils/pagination.util';
import { slugify, withUniqueSuffix } from '../../../common/utils/slugify';

const SORTABLE_FIELDS = ['title', 'category', 'createdAt', 'updatedAt'];

@Injectable()
export class ArticlesService {
  constructor(private readonly repo: ArticlesRepository) { }

  async list(query: QueryArticleDto, isPublic: boolean) {
    const limit = query.limit ?? 10;
    const page = query.page ?? 1;
    let status: ArticleStatus | undefined;
    if (query.status) {
      status = query.status;
    } else if (isPublic && !query.all) {
      status = ArticleStatus.PUBLISHED;
    }
    const { items, totalItems } = await this.repo.findMany({
      category: query.category,
      status,
      search: query.search,
      skip: paginationSkip(page, limit),
      take: limit,
      orderBy: parseSort(query.sort, SORTABLE_FIELDS, { createdAt: 'desc' }),
    });
    return { data: items.map((a) => this.toResponse(a)), meta: buildPaginationMeta(page, limit, totalItems) };
  }

  async findOne(slugOrId: string, isPublic: boolean) {
    const article = await this.repo.findBySlugOrId(slugOrId);
    if (!article || (isPublic && article.status !== ArticleStatus.PUBLISHED)) {
      throw new NotFoundException('Artikel tidak ditemukan.');
    }
    return this.toResponse(article);
  }

  async create(dto: CreateArticleDto) {
    const slug = await this.generateUniqueSlug(dto.title);
    const article = await this.repo.create({
      title: dto.title,
      slug,
      category: dto.category,
      date: this.formatIndonesianDate(new Date()),
      status: dto.status,
      author: dto.author,
      content: dto.content,
      imageUrl: dto.image,
      tags: dto.tags as Prisma.InputJsonValue,
    });
    return this.toResponse(article);
  }

  async update(id: string, dto: UpdateArticleDto) {
    const existing = await this.repo.findById(BigInt(id));
    if (!existing) throw new NotFoundException('Artikel tidak ditemukan.');
    const article = await this.repo.update(BigInt(id), {
      ...(dto.title !== undefined ? { title: dto.title } : {}),
      ...(dto.category !== undefined ? { category: dto.category } : {}),
      ...(dto.status !== undefined ? { status: dto.status } : {}),
      ...(dto.author !== undefined ? { author: dto.author } : {}),
      ...(dto.content !== undefined ? { content: dto.content } : {}),
      ...(dto.image !== undefined ? { imageUrl: dto.image } : {}),
      ...(dto.tags !== undefined ? { tags: dto.tags as Prisma.InputJsonValue } : {}),
    });
    return this.toResponse(article);
  }

  async remove(id: string, role: string) {
    if (role === 'EDITOR') {
      throw new ForbiddenException('Pengguna tidak memiliki role yang diizinkan untuk resource ini.');
    }
    const existing = await this.repo.findById(BigInt(id));
    if (!existing) throw new NotFoundException('Artikel tidak ditemukan.');
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
      if (attempt > 50) throw new ConflictException('Tidak dapat membuat slug unik untuk artikel ini.');
    }
  }

  private toResponse(article: NonNullable<Awaited<ReturnType<ArticlesRepository['findById']>>>) {
    const statusMap: Record<string, string> = {
      PUBLISHED: 'Published',
      DRAFT: 'Draft',
    };
    return {
      id: article.id.toString(),
      title: article.title,
      slug: article.slug,
      category: article.category,
      date: article.date,
      status: statusMap[article.status] || article.status,
      author: article.author,
      content: article.content,
      image: article.imageUrl,
      tags: article.tags,
    };
  }
}