import { FastifyRequest } from 'fastify';
import { OptionsOfJSONResponseBody } from 'got';
import { AuthenticationProvider } from '../types/AuthenticationProvider';

export class TokenAuthenticationProvider implements AuthenticationProvider {
    private constructor(private token: string) {}

    public isAllowed(request: FastifyRequest) {
        return request.headers.authorization === this.token;
    }

    public prepare(options: OptionsOfJSONResponseBody) {
        options.headers ||= {};
        options.headers.authorization = this.token;
        return options;
    }

    public static create(token: string) {
        return new TokenAuthenticationProvider(token);
    }
};
