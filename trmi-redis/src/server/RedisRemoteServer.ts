import { RemoteServiceContainer, RemoteServer, RemoteCallResponse, ClientEmitter } from 'trmi';
import { RedisOptions } from 'ioredis';
import { metadata } from 'trmi';
import { createConnectionPool, getServiceNameFromChannel, getServerChannelName, getClientChannelName } from '../util';
import { RedisClientPool } from '../types/RedisClientPool';
import { RedisRemoteCall } from '../types/RedisRemoteCall';
import { RedisRemoteCallResponse } from '../types/RedisRemoteCallResponse';

export type RedisRemoteServerOptions = {
    handshake?: boolean;
    settings: RedisOptions;
};

export class RedisRemoteServer extends ClientEmitter implements RemoteServer<RedisClientPool> {
    private pool: RedisClientPool;
    private container: RemoteServiceContainer;
    private handshakeEnabled: boolean;

    private constructor(options: RedisRemoteServerOptions) {
        super();

        this.pool = createConnectionPool(options.settings);
        this.container = new RemoteServiceContainer();
        this.handshakeEnabled = options.handshake ?? false;
    }

    public get() {
        return this.pool;
    }

    public from(...services: Function[]) {
        for (const Service of services) {
            const definition = metadata.getServiceDefinition(Service);
            const instance = new Service.prototype.constructor();

            this.container.add(instance, definition);
        }

        return this;
    }

    private async respond(call: RedisRemoteCall, response: RemoteCallResponse | { handshake: true }) {
        const data: RedisRemoteCallResponse = {
            ...response,
            id: call.id,
        };

        try {
            await this.pool.publisher.publish(
                getClientChannelName(call.client), 
                JSON.stringify(data)
            );
        } catch (e) {
            if (!this.call('error', e)) {
                throw e;
            }
        }
    }

    private handshake(call: RedisRemoteCall) {
        return this.respond(call, { handshake: true });
    }

    private async onMessage(channel, message) {
        const call: RedisRemoteCall = JSON.parse(message);

        if (this.handshakeEnabled) {
            this.handshake(call);
        }

        const serviceName = getServiceNameFromChannel(channel);
        const response = await this.container.call(serviceName, call);

        await this.respond(call, response);
    }

    // TODO: retries?
    public async start() {
        const channels = Object.keys(this.container.get()).map((name) => getServerChannelName(name));

        await this.pool.subscriber
            .on('message', (channel, message) => this.onMessage(channel, message))
            .subscribe(...channels);

        return this;
    }

    public static create(options: RedisRemoteServerOptions) {
        const server = new RedisRemoteServer(options);
        return server;
    }
};