import { RemoteMethodMiddleware } from '../types/RemoteMethodMiddleware';
import { RMI_METHOD } from '../metadata';

export type RemoteMethodOptions = {
    middleware?: RemoteMethodMiddleware[];
};

export const RemoteMethod = (options?: RemoteMethodOptions): MethodDecorator => {
    return (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) => {
        Reflect.defineMetadata(
            RMI_METHOD, 
            { 
                name: propertyKey, 
                middleware: options?.middleware ?? null,
            }, 
            target, 
            propertyKey
        );
    };
};