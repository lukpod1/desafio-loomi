import { Injectable } from '@nestjs/common';
import { CacheData, CacheProvider } from './cache.provider.interface';
import Redis from 'ioredis';

@Injectable()
export class RedisProvider implements CacheProvider {
  private client: Redis;

  constructor(redisUrl: any) {
    this.client = new Redis(redisUrl);
  }

  async get(key: string) {
    const data = await this.client.get(key);
    return data ? JSON.parse(data) : null;
  }

  async set(data: CacheData, expiry?: number) {
    if (expiry) {
      await this.client.set(data.key, JSON.stringify(data.value), 'EX', expiry);
    } else {
      await this.client.set(data.key, JSON.stringify(data.value));
    }
  }

  async del(key: string) {
    await this.client.del(key);
  }
}
