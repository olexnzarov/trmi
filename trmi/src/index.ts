import 'reflect-metadata';

export * as metadata from './metadata';

export * from './types/RemoteCall';
export * from './types/RemoteCallResponse';
export * from './types/RemoteClient';
export * from './types/RemoteMethodDefinition';
export * from './types/RemoteMethodMiddleware';
export * from './types/RemoteServer';
export * from './types/RemoteServiceDefinition';

export * from './decorators/RemoteMethod';
export * from './decorators/RemoteService';

export * from './exceptions/RemoteCallTimeout';
export * from './exceptions/RemoteServiceDuplication';
export * from './exceptions/RemoteServiceMissing';

export * from './core/RemoteServiceContainer';
export * from './core/RemoteServiceWrapper';
export * from './core/ClientEmitter';
