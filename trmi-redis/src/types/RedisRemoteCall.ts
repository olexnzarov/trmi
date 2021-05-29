import { RemoteCall } from 'trmi';

export interface RedisRemoteCall extends RemoteCall {
    id: string;
    client: string;
};