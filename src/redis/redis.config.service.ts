import * as redisStore from 'cache-manager-ioredis';
import { Injectable } from '@nestjs/common';
import { CacheModuleOptions, CacheOptionsFactory } from '@nestjs/cache-manager';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RedisConfigService implements CacheOptionsFactory {
  constructor(private readonly configService: ConfigService) {}
  async createCacheOptions(): Promise<CacheModuleOptions> {
    return {
      store: redisStore,
      host: this.configService.get('REDIS_HOST'),
      port: this.configService.get('REDIS_PORT'),
    };
  }
}
