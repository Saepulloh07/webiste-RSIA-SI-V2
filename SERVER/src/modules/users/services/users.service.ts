import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersRepository } from '../repositories/users.repository';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { QueryUserDto } from '../dto/query-user.dto';
import { buildPaginationMeta, paginationSkip, parseSort } from '../../../common/utils/pagination.util';

const SORTABLE_FIELDS = ['name', 'email', 'role', 'createdAt'];
const SALT_ROUNDS = 10;

@Injectable()
export class UsersService {
  constructor(private readonly repo: UsersRepository) {}

  async list(query: QueryUserDto) {
    const limit = query.limit ?? 10;
    const page = query.page ?? 1;
    const { items, totalItems } = await this.repo.findMany({
      role: query.role,
      search: query.search,
      skip: paginationSkip(page, limit),
      take: limit,
      orderBy: parseSort(query.sort, SORTABLE_FIELDS, { createdAt: 'desc' }),
    });
    return { data: items.map((u) => this.toResponse(u)), meta: buildPaginationMeta(page, limit, totalItems) };
  }

  async create(dto: CreateUserDto) {
    const existing = await this.repo.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException('Email sudah digunakan oleh akun lain.');
    }
    const passwordHash = await bcrypt.hash(dto.password, SALT_ROUNDS);
    const user = await this.repo.create({
      name: dto.name,
      email: dto.email,
      passwordHash,
      role: dto.role,
    });
    return this.toResponse(user);
  }

  async update(id: string, dto: UpdateUserDto) {
    const existing = await this.repo.findById(BigInt(id));
    if (!existing) throw new NotFoundException('Pengguna tidak ditemukan.');

    if (dto.email && dto.email !== existing.email) {
      const emailTaken = await this.repo.findByEmail(dto.email);
      if (emailTaken) throw new ConflictException('Email sudah digunakan oleh akun lain.');
    }

    const user = await this.repo.update(BigInt(id), {
      ...(dto.name !== undefined ? { name: dto.name } : {}),
      ...(dto.email !== undefined ? { email: dto.email } : {}),
      ...(dto.role !== undefined ? { role: dto.role } : {}),
      ...(dto.password !== undefined ? { passwordHash: await bcrypt.hash(dto.password, SALT_ROUNDS) } : {}),
    });
    return this.toResponse(user);
  }

  async remove(id: string) {
    const existing = await this.repo.findById(BigInt(id));
    if (!existing) throw new NotFoundException('Pengguna tidak ditemukan.');
    await this.repo.delete(BigInt(id));
  }

  private toResponse(user: NonNullable<Awaited<ReturnType<UsersRepository['findById']>>>) {
    const roleMap: Record<string, string> = {
      SUPER_ADMIN: 'Super Admin',
      ADMIN: 'Admin',
      EDITOR: 'Editor',
    };
    // password_hash is never exposed to the client.
    return {
      id: user.id.toString(),
      name: user.name,
      email: user.email,
      role: roleMap[user.role] || user.role,
      lastLogin: user.lastLoginAt ? user.lastLoginAt.toISOString() : null,
      createdAt: user.createdAt.toISOString(),
    };
  }
}
