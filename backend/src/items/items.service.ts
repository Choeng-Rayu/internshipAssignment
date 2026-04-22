import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CacheService } from '../cache/cache.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { Item } from '@prisma/client';

@Injectable()
export class ItemsService {
  constructor(
    private prisma: PrismaService,
    private cache: CacheService,
  ) {}

  async create(userId: string, createItemDto: CreateItemDto): Promise<Item> {
    const item = await this.prisma.item.create({
      data: {
        ...createItemDto,
        userId,
      },
    });
    await this.cache.delete(`items:list:${userId}`);
    return item;
  }

  async findAll(userId: string): Promise<Item[]> {
    const cacheKey = `items:list:${userId}`;
    const cached = await this.cache.get<Item[]>(cacheKey);
    if (cached) return cached;

    const items = await this.prisma.item.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    await this.cache.set(cacheKey, items, 300);
    return items;
  }

  async findOne(id: string, userId: string): Promise<Item> {
    const item = await this.prisma.item.findUnique({
      where: { id },
    });

    if (!item) {
      throw new NotFoundException('Item not found');
    }

    if (item.userId !== userId) {
      throw new ForbiddenException(
        'You do not have permission to access this item',
      );
    }

    return item;
  }

  async update(
    id: string,
    userId: string,
    updateItemDto: UpdateItemDto,
  ): Promise<Item> {
    await this.findOne(id, userId);

    const item = await this.prisma.item.update({
      where: { id },
      data: updateItemDto,
    });

    await this.cache.delete(`items:list:${userId}`);
    return item;
  }

  async remove(id: string, userId: string): Promise<void> {
    await this.findOne(id, userId);

    await this.prisma.item.delete({
      where: { id },
    });

    await this.cache.delete(`items:list:${userId}`);
  }
}
