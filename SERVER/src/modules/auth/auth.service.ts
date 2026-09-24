import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (!user) {
      throw new UnauthorizedException('Email atau password yang Anda masukkan salah.');
    }

    const passwordMatches = await bcrypt.compare(dto.password, user.passwordHash);
    if (!passwordMatches) {
      throw new UnauthorizedException('Email atau password yang Anda masukkan salah.');
    }

    const previousLogin = user.lastLoginAt;
    const updated = await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    const payload = { sub: updated.id.toString(), email: updated.email, role: updated.role };

    const token = this.jwt.sign(payload, {
      secret: this.config.get<string>('jwt.secret'),
      expiresIn: this.config.get<string>('jwt.expiresIn'),
    });
    const refreshToken = this.jwt.sign(payload, {
      secret: this.config.get<string>('jwt.refreshSecret'),
      expiresIn: this.config.get<string>('jwt.refreshExpiresIn'),
    });

    return {
      token,
      refreshToken,
      user: {
        id: updated.id.toString(),
        name: updated.name,
        email: updated.email,
        role: updated.role,
        lastLogin: previousLogin ? previousLogin.toISOString() : null,
      },
    };
  }

  async me(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: BigInt(userId) } });
    if (!user) {
      throw new UnauthorizedException('Akses ditolak. Token tidak valid atau tidak disertakan.');
    }
    return {
      id: user.id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      lastLogin: user.lastLoginAt ? user.lastLoginAt.toISOString() : null,
    };
  }

  /**
   * Stateless logout: per [UNRESOLVED] note in the analysis step, no
   * refresh-token/blacklist table is documented in Section 2, so there is
   * nothing server-side to revoke. The client is expected to discard the
   * token. This endpoint exists to give the frontend a clean call to make,
   * and is a natural place to plug in a blacklist store if one is added later.
   */
  async logout(): Promise<void> {
    return;
  }
}
