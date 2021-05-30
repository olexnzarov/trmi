import { RemoteServiceDefinition, RemoteMethodDefinitionMap } from './types/RemoteServiceDefinition';

export const RMI_SERVICE = Symbol.for('rmi:service');

export const RMI_METHOD = Symbol.for('rmi:method');

export const getServiceDefinition = ({ prototype }: Function): RemoteServiceDefinition => {
    if (!Reflect.hasMetadata(RMI_SERVICE, prototype)) {
        throw new Error('Remote service metadata is missing');
    }

    const meta = Reflect.getMetadata(RMI_SERVICE, prototype);
    const methods: RemoteMethodDefinitionMap = {};

    Object
        .getOwnPropertyNames(prototype)
        .filter((key) => Reflect.hasMetadata(RMI_METHOD, prototype, key))
        .forEach((key) => {
            const meta =  Reflect.getMetadata(RMI_METHOD, prototype, key);

            methods[meta.name] = {};
        });

    return {
        name: meta.name,
        methods: methods,
    };
};
