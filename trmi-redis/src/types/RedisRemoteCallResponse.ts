import { RemoteCallResponse } from 'trmi';

export interface RedisRemoteCallResponse extends RemoteCallResponse {
    id: string;
    handshake?: boolean;
};
