import IORedis from 'ioredis';

export const redisHelper = {
  client: null as unknown as IORedis.Redis,
  async connect(url: string): Promise<void> {
    /* istanbul ignore next */
    this.client = new IORedis(url);
  },
  async disconnect(): Promise<void> {
    this.client.disconnect();
    this.client = null as any;
  },
  async set<T>(key: string, value: T): Promise<boolean> {
    const ok = await this.client.set(key, JSON.stringify(value));
    return ok == 'OK';
  },
  async setex<T>(key: string, value: T, ttl: number): Promise<boolean> {
    const ok = await this.client.set(key, JSON.stringify(value), 'EX', ttl);
    return ok == 'OK';
  },
  async get<T>(key: string): Promise<T | undefined> {
    const result = await this.client.get(key);
    if (!result) return undefined;
    return JSON.parse(result);
  },
  async exists(key: string): Promise<boolean> {
    const numberOfKey = await this.client.exists(key);
    return numberOfKey === 1;
  },
  async del(key: string): Promise<boolean> {
    const deletedKeys = await this.client.del(key);
    return deletedKeys > 0;
  },
};
