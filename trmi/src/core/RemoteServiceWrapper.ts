import { RemoteCall } from '../types/RemoteCall';
import { RemoteCallResponse } from '../types/RemoteCallResponse';
import { RemoteServiceDefinition } from '../types/RemoteServiceDefinition';

export class RemoteServiceWrapper {
    constructor(private instance: any, private definition: RemoteServiceDefinition) {}

    public async call({ method, params }: RemoteCall): Promise<RemoteCallResponse> {
        try {
            const definition = this.definition.methods[method];
            const fn: Function = this.instance[method];

            if (!definition) {
                throw new Error(`Method doesn't exist on this service - ${this.definition.name}.${method}`);
            }

            if (!fn) {
                throw new Error(`Method isn't defined on the instance of this service - ${this.definition.name}.${method}`);
            }

            const data = fn.apply(this.instance, params);

            return { data: data.then ? await data : data };
        } catch (e) {
            return { error: e.message ?? e.toString() };
        }
    }
};
