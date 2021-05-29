import { Redis } from 'ioredis';

export interface RedisClientPool {
    publisher: Redis;
    subscriber: Redis;
};