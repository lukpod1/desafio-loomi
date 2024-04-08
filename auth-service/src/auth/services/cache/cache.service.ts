import { Injectable } from '@nestjs/common';
import { CacheProvider, CacheData } from './cache.provider.interface';
import { RedisProvider } from './redis.provider';

@Injectable()
export class CacheService {
  private temporaryProvider: CacheProvider;
  private mainProvider: CacheProvider;

  constructor() {
    const temporaryRedisUrl =
      process.env.MODE === 'prod'
        ? process.env.REDIS_TEMPORARY_URL
        : {
            host: 'localhost',
            port: 6379,
            maxRetriesPerRequest: null,
          };
    const mainRedisUrl =
      process.env.MODE === 'prod'
        ? process.env.REDIS_MAIN_URL
        : {
            host: 'localhost',
            port: 6380,
            maxRetriesPerRequest: null,
          };
    this.temporaryProvider = new RedisProvider(temporaryRedisUrl);
    this.mainProvider = new RedisProvider(mainRedisUrl);
  }

  async get(key: string, isTemporary = false) {
    const provider = isTemporary ? this.temporaryProvider : this.mainProvider;
    return provider.get(key);
  }

  async set(data: CacheData, isTemporary = false, expiry?: number) {
    const provider = isTemporary ? this.temporaryProvider : this.mainProvider;
    if (expiry && isTemporary) {
      await provider.set(data, expiry);
    } else {
      await provider.set(data);
    }
  }

  async del(key: string, isTemporary = false) {
    const provider = isTemporary ? this.temporaryProvider : this.mainProvider;
    await provider.del(key);
  }
}
