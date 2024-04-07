import { CacheModuleAsyncOptions } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { redisStore } from 'cache-manager-redis-store';

export const RedisOptions: CacheModuleAsyncOptions = {
  isGlobal: true,
  imports: [ConfigModule],
  useFactory: async () => {
    const store = await redisStore({
      url: process.env.REDIS_URL,
    });
    return {
      store: () => store,
    };
  },
  inject: [ConfigService],
};
