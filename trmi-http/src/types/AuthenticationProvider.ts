import { FastifyRequest } from 'fastify';
import { OptionsOfJSONResponseBody } from 'got';

export interface AuthenticationProvider {
    isAllowed: (req: FastifyRequest) => boolean | Promise<boolean>;
    prepare: (options: OptionsOfJSONResponseBody) => OptionsOfJSONResponseBody | Promise<OptionsOfJSONResponseBody>;
};
