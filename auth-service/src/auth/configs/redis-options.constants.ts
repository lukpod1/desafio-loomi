import { CacheModuleAsyncOptions } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { redisStore } from 'cache-manager-redis-store';

export const RedisOptions: CacheModuleAsyncOptions = {
  isGlobal: true,
  imports: [ConfigModule],
  useFactory: async () => {
    const options =
      process.env.MODE === 'prod'
        ? { url: process.env.REDIS_URL }
        : { host: 'localhost', port: 6379 };
    const store = await redisStore(options);
    return {
      store: () => store,
    };
  },
  inject: [ConfigService],
};
