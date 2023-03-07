import { redisHelper } from '../connections/redis-helper';

export class RedisRepository {
  async save(key: string, value: any): Promise<boolean> {
    return redisHelper.set(key, value);
  }

  async saveEx(key: string, value: any, time: number): Promise<boolean> {
    return redisHelper.setex(key, value, time);
  }

  async get<T>(key: string): Promise<T | undefined> {
    return redisHelper.get<T>(key);
  }

  async delete(key: string): Promise<boolean> {
    return redisHelper.del(key);
  }
}
