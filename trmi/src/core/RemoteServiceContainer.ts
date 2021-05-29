import { RemoteServiceDuplication } from '../exceptions/RemoteServiceDuplication';
import { RemoteServiceMissing } from '../exceptions/RemoteServiceMissing';
import { RemoteCall } from '../types/RemoteCall';
import { RemoteServiceDefinition } from '../types/RemoteServiceDefinition';
import { RemoteServiceWrapper } from './RemoteServiceWrapper';

export type RemoteServiceWrapperMap = { [name: string]: RemoteServiceWrapper };

export class RemoteServiceContainer {
    private services: RemoteServiceWrapperMap = {};

    public get() {
        return this.services;
    }

    public clear() {
        this.services = {};
    }

    public add(instance: any, definition: RemoteServiceDefinition) {
        if (this.services[definition.name]) {
            throw new RemoteServiceDuplication(definition.name);
        }
        
        const wrapper = new RemoteServiceWrapper(instance, definition);
    
        this.services[definition.name] = wrapper;

        return wrapper;
    }

    public call(serviceName: string, call: RemoteCall) {
        const wrapper = this.services[serviceName];

        if (wrapper == null) {
            throw new RemoteServiceMissing(serviceName);
        }

        return wrapper.call(call);
    }
};