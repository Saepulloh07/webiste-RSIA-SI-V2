import { Injectable } from '@nestjs/common';
import { Prisma, UserRole } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';

export interface UserListFilter {
  role?: UserRole;
  search?: string;
  skip: number;
  take: number;
  orderBy: Record<string, 'asc' | 'desc'>;
}

@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findMany(filter: UserListFilter) {
    const where: Prisma.UserWhereInput = {
      ...(filter.role ? { role: filter.role } : {}),
      ...(filter.search
        ? { OR: [{ name: { contains: filter.search } }, { email: { contains: filter.search } }] }
        : {}),
    };
    const [items, totalItems] = await this.prisma.$transaction([
      this.prisma.user.findMany({ where, skip: filter.skip, take: filter.take, orderBy: filter.orderBy }),
      this.prisma.user.count({ where }),
    ]);
    return { items, totalItems };
  }

  findById(id: bigint) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  create(data: Prisma.UserCreateInput) {
    return this.prisma.user.create({ data });
  }

  update(id: bigint, data: Prisma.UserUpdateInput) {
    return this.prisma.user.update({ where: { id }, data });
  }

  delete(id: bigint) {
    return this.prisma.user.delete({ where: { id } });
  }

  countSuperAdmins() {
    return this.prisma.user.count({ where: { role: UserRole.SUPER_ADMIN } });
  }
}
