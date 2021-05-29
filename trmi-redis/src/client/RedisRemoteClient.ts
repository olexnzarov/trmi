import { RedisOptions } from 'ioredis';
import { createConnectionPool, getClientChannelName, getServerChannelName, uuid } from '../util';
import { RemoteClient, ClientEmitter } from 'trmi';
import { RedisClientPool } from '../types/RedisClientPool';
import { RedisRemoteCall } from '../types/RedisRemoteCall';
import { RedisRemoteCallResponse } from '../types/RedisRemoteCallResponse';
import { TrackedPromise } from './TrackedPromise';

export type RedisRemoteClientOptions = {
    timeout?: number;
    handshakeTimeout?: number;
    settings: RedisOptions;
};


export type TrackedCall = {
    promise: TrackedPromise;
    handshake?: NodeJS.Timeout;
    timeout: NodeJS.Timeout;
};

export type CallMap = {
    [id: string]: TrackedCall;
};

const clearTimeouts = (call: TrackedCall) => {
    if (call == null) { return; }

    if (call.handshake != null) {
        clearTimeout(call.handshake);
        delete call.handshake;
    }

    if (call.timeout != null) {
        clearTimeout(call.timeout);
        delete call.timeout;
    }
};

export class RedisRemoteClient extends ClientEmitter implements RemoteClient {
    private id: string;
    private pool: RedisClientPool;
    private calls: CallMap;
    private timeout: number;
    private handshakeTimeout?: number;

    private constructor(options: RedisRemoteClientOptions) {
        super();

        this.calls = {};
        this.id = uuid();
        this.pool = createConnectionPool(options.settings);
        this.timeout = options.timeout;
        this.handshakeTimeout = options.handshakeTimeout && options.handshakeTimeout > 0 ? options.handshakeTimeout : null;
    }

    private onMessage(message: string) {
        const { id, data, error, handshake }: RedisRemoteCallResponse = JSON.parse(message);
        const call = this.calls[id];

        if (call == null) { return; }

        if (handshake) {
            if (call.handshake != null) {
                clearInterval(call.handshake);
                delete call.handshake;
            }

            return;
        }

        if (error) {
            call.promise.reject(error);
        } else {
            call.promise.resolve(data);
        }

        delete this.calls[id];
    }

    private track(id: string) {
        const promise = TrackedPromise.create();

        const timeout = (ms: number) => {
            if (ms == null) { return null; }

            return setTimeout(
                () => {
                    promise.timeout();
                    clearTimeouts(this.calls[id]);
                    delete this.calls[id];
                }, 
                ms
            );
        };

        this.calls[id] = {
            promise,
            timeout: timeout(this.timeout),
            handshake: timeout(this.handshakeTimeout),
        };

        return promise.get();
    }

    private async callService(serviceName: string, method: string, params: any[]) {
        const id = uuid();

        const call: RedisRemoteCall = {
            client: this.id,
            id,
            method,
            params
        };

        try {
            await this.pool.publisher.publish(
                getServerChannelName(serviceName),
                JSON.stringify(call)
            );
        } catch (e) {
            if (!this.call('error', e)) { throw e; }
        }

        return await this.track(id);
    }

    public getService<T>(name: string) {
        return new Proxy<any>({}, {
            get: (_, method) => (...params) => this.callService(name, method.toString(), params),
        }) as T;
    }

    public async start() {
        await this.pool.subscriber
            .on('message', (_, message) => this.onMessage(message))
            .subscribe(getClientChannelName(this.id));

        return this;
    }

    public static create(options: RedisRemoteClientOptions) {
        const client = new RedisRemoteClient(options);
        return client;
    }
};
