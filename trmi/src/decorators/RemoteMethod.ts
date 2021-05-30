import { RMI_METHOD } from '../metadata';

export type RemoteMethodOptions = {};

export const RemoteMethod = (options?: RemoteMethodOptions): MethodDecorator => {
    return (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) => {
        Reflect.defineMetadata(
            RMI_METHOD, 
            { 
                name: propertyKey, 
            }, 
            target, 
            propertyKey
        );
    };
};