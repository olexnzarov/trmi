import { RemoteServiceContainer, RemoteServer, RemoteCallResponse, ClientEmitter } from 'trmi';
import { metadata } from 'trmi';
import fastify, { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { AuthenticationProvider } from '../types/AuthenticationProvider';
import { RemoteCallMalformed } from '../exceptions/RemoteCallMalformed';
import { RemoteCallUnauthorized } from '../exceptions/RemoteCallUnauthorized';

export type HttpRemoteServerOptions = {
    port?: number;
    authentication?: AuthenticationProvider;
};

export class HttpRemoteServer extends ClientEmitter implements RemoteServer<FastifyInstance> {
    public static DEFAULT_PORT = 3478;
    public static SERVICE_HEADER = 'x-rmi-service';

    private container: RemoteServiceContainer;
    private server: FastifyInstance;
    private port: number;
    private authentication?: AuthenticationProvider;

    private constructor(options: HttpRemoteServerOptions) {
        super();

        this.container = new RemoteServiceContainer();
        this.server = fastify();
        this.port = options.port ?? HttpRemoteServer.DEFAULT_PORT;
        this.authentication = options.authentication ?? null;
    }

    public get() {
        return this.server;
    }

    public from(...services: Function[]) {
        for (const Service of services) {
            const definition = metadata.getServiceDefinition(Service);
            const instance = new Service.prototype.constructor();

            this.container.add(instance, definition);
        }

        return this;
    }

    private async onRequest(request: FastifyRequest, reply: FastifyReply) {
        let response: RemoteCallResponse;

        try {
            const headers = request.headers[HttpRemoteServer.SERVICE_HEADER];
            const service = Array.isArray(headers) ? headers[0] : headers;

            if (typeof(request.body) != 'object' || !service) {
                throw new RemoteCallMalformed();
            }

            if (this.authentication != null && !await this.authentication.isAllowed(request)) {
                throw new RemoteCallUnauthorized();
            }

            response = await this.container.call(service, request.body as any);
        } catch (e) {
            response = { error: e.message ?? e.toString() };
        }

        reply.send(response);
    }

    public async start() {
        this.server.post('/', (request, reply) => this.onRequest(request, reply));
        await this.server.listen(this.port);
        return this;
    }

    public static create(options: HttpRemoteServerOptions) {
        const server = new HttpRemoteServer(options);
        return server;
    }
};
