import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { REDIS_CONFIG } from '../constants';

@Injectable()
export class RedisService {
  private client: Redis;

  constructor() {
    this.client = new Redis({
      host: REDIS_CONFIG.HOST,
      port: REDIS_CONFIG.PORT,
      password: REDIS_CONFIG.PASSWORD,
      maxRetriesPerRequest: 3,
      connectTimeout: REDIS_CONFIG.CONNECTION_TIMEOUT,
    });
  }

  async set(key: string, value: any, ttlSeconds = 60): Promise<'OK'> {
    return this.client.set(key, JSON.stringify(value), 'EX', ttlSeconds);
  }

  async get<T = any>(key: string): Promise<T | null> {
    const result = await this.client.get(key);
    return result ? (JSON.parse(result) as T) : null;
  }

  async del(key: string): Promise<number> {
    return this.client.del(key);
  }
}
