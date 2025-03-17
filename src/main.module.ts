import type { RedisClientOptions } from 'redis';
import { Module, ValidationPipe } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseConfigModule } from './database/database.module';
import { DatabaseConfigService } from './database/database.service';
import { UsersModule } from './users/users.module';
import { APP_PIPE } from '@nestjs/core';
import { UsersAuthStrategy } from './strategies/user.strategy';
import { CacheModule } from '@nestjs/cache-manager';
import { RedisConfigModule } from './redis/redis.config.module';
import { RedisConfigService } from './redis/redis.config.service';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [DatabaseConfigModule],
      useClass: DatabaseConfigService,
      inject: [DatabaseConfigService],
    }),
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true
    }),
    CacheModule.registerAsync<RedisClientOptions>({
      isGlobal: true,
      imports: [RedisConfigModule],
      useClass: RedisConfigService,
      inject: [RedisConfigService],
    }),
    AuthModule,
    ProductsModule,
    UsersModule
  ],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
    UsersAuthStrategy
  ],
})
export class MainModule {}
