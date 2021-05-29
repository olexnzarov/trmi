import { RemoteCall } from './RemoteCall';

export type RemoteMethodMiddlewareNext = (error?: any) => void;

export type RemoteMethodMiddleware = (call: RemoteCall, next: RemoteMethodMiddlewareNext) => void;
