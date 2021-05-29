import { RemoteMethodMiddleware } from './RemoteMethodMiddleware';

export interface RemoteMethodDefinition {
    middleware?: RemoteMethodMiddleware[];
};
