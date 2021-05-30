import got, { OptionsOfJSONResponseBody } from 'got';
import { HttpRemoteServer } from '../server/HttpRemoteServer';
import { AuthenticationProvider } from '../types/AuthenticationProvider';
import { ClientEmitter, RemoteCall, RemoteCallResponse, RemoteClient } from 'trmi';

export type HttpRemoteClientProperties = {
    url: string;
    authentication?: AuthenticationProvider;
};

export class HttpRemoteClient extends ClientEmitter implements RemoteClient {
    private url: string;
    private authentication?: AuthenticationProvider;

    private constructor(options: HttpRemoteClientProperties) {
        super();

        this.url = options.url;
        this.authentication = options.authentication ?? null;
    }

    private async callService(serviceName: string, method: string, params: any[]) {
        const call: RemoteCall = {
            method,
            params
        };

        let options: OptionsOfJSONResponseBody = { 
            json: call, 
            responseType: 'json',
            headers: {
                [HttpRemoteServer.SERVICE_HEADER]: serviceName,
            },
        };

        if (this.authentication) {
            options = await this.authentication.prepare(options);
        }

        const { body } = await got.post(this.url, options);
        const { data, error }: RemoteCallResponse = body;

        if (error) {
            throw new Error(error);
        }

        return data;
    }

    public getService<T>(name: string) {
        return new Proxy<any>({}, {
            get: (_, method) => (...params) => this.callService(name, method.toString(), params),
        }) as T;
    }

    public start() {
        return this;
    }

    public static create(options: HttpRemoteClientProperties) {
        const client = new HttpRemoteClient(options);
        return client;
    }
};
