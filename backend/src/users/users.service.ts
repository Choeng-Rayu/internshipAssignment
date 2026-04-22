import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CacheService } from '../cache/cache.service';
import { User, UserRole } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private cache: CacheService,
  ) {}

  async create(data: {
    email?: string;
    passwordHash?: string;
    role?: UserRole;
    googleOauthId?: string;
    telegramOauthId?: string;
    telegramUsername?: string;
    telegramName?: string;
  }) {
    const user = await this.prisma.user.create({
      data,
      select: {
        id: true,
        email: true,
        role: true,
        googleOauthId: true,
        telegramOauthId: true,
        telegramUsername: true,
        telegramName: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return user;
  }

  async findById(id: string) {
    const cacheKey = `user:profile:${id}`;
    const cached = await this.cache.get<Omit<User, 'passwordHash'>>(cacheKey);
    if (cached) return cached;

    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        role: true,
        googleOauthId: true,
        telegramOauthId: true,
        telegramUsername: true,
        telegramName: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (user) {
      await this.cache.set(cacheKey, user, 3600); // 1 hour TTL
    }
    return user;
  }

  async findByIdWithPassword(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findByGoogleId(googleOauthId: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { googleOauthId } });
  }

  async findByTelegramId(telegramOauthId: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { telegramOauthId } });
  }

  async findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        role: true,
        googleOauthId: true,
        telegramOauthId: true,
        telegramUsername: true,
        telegramName: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async update(
    id: string,
    data: Partial<{
      email: string;
      passwordHash: string;
      role: UserRole;
      googleOauthId: string;
      telegramOauthId: string;
      telegramUsername: string;
      telegramName: string;
    }>,
  ) {
    const user = await this.prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        email: true,
        role: true,
        googleOauthId: true,
        telegramOauthId: true,
        telegramUsername: true,
        telegramName: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    await this.cache.delete(`user:profile:${id}`);
    return user;
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({ where: { id } });
    await this.cache.delete(`user:profile:${id}`);
  }

  async linkGoogleAccount(userId: string, googleOauthId: string) {
    return this.update(userId, { googleOauthId });
  }

  async linkTelegramAccount(
    userId: string,
    telegramOauthId: string,
    telegramUsername?: string,
    telegramName?: string,
  ) {
    return this.update(userId, {
      telegramOauthId,
      telegramUsername,
      telegramName,
    });
  }
}
