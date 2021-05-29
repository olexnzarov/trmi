import { RemoteMethodMiddleware } from '../types/RemoteMethodMiddleware';
import { RMI_SERVICE } from '../metadata';
import { RemoteServiceNameMissing } from '../exceptions/RemoteServiceNameMissing';
import { InvalidRemoteServiceName } from '../exceptions/InvalidRemoteServiceName';

export type RemoteServiceOptions = {
    name?: string;
    middleware?: RemoteMethodMiddleware[];
};

export const RemoteService = (options?: RemoteServiceOptions): ClassDecorator => {
    return (ctor) => {
        const serviceName = options?.name ?? ctor.name;

        if (serviceName == null) {
            throw new RemoteServiceNameMissing();
        }

        if (serviceName.match(/[.~]/) != null) {
            throw new InvalidRemoteServiceName(serviceName);
        }

        Reflect.defineMetadata(
            RMI_SERVICE, 
            { 
                name: serviceName, 
                middleware: options?.middleware ?? null,
            }, 
            ctor.prototype
        );
    };
};