import { RedisOptions } from 'ioredis';
import { v4 as _uuid } from 'uuid';
import { RedisClientPool } from './types/RedisClientPool';
import RedisClient from 'ioredis';

export const getServerChannelName = (service: string) => `trmi.in.${service}`;

export const getServiceNameFromChannel = (stream: string) => {
    const match = stream.match(/trmi\..+\.(.+)/);
    return match[match.length - 1];
};

export const getClientChannelName = (client: string) => `trmi.out.${client}`;

export const uuid = () => _uuid();

export const createConnectionPool = (options: RedisOptions): RedisClientPool => {
    return {
        subscriber: new RedisClient(options),
        publisher: new RedisClient(options),
    };
};
