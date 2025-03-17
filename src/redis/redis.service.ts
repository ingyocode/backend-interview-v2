import { Cache } from 'cache-manager';
import Redis from 'ioredis';
import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { LikeProductEnumType } from './interfaces/redis.type';

@Injectable()
export class RedisService {
  LIKE_ITEM_KEY = 'like-'

  constructor(@Inject(CACHE_MANAGER) private redis: Cache) {}

  createProductLikeKey(productId: number) {
    return this.LIKE_ITEM_KEY+productId;
  }

  async get(productId: number): Promise<string> {
    return this.redis.get(this.createProductLikeKey(productId));
  }

  async update(productId: number, type: LikeProductEnumType): Promise<number> {
    const incryby = type === LikeProductEnumType.LIKE ? 1 : -1;

    const result = await this.get(productId)
    return this.redis.set(this.createProductLikeKey(productId), Number(result) + incryby);
  }
}
