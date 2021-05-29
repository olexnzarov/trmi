import { RemoteMethodDefinition } from './RemoteMethodDefinition';

export type RemoteMethodDefinitionMap = {
    [method: string]: RemoteMethodDefinition;
};

export interface RemoteServiceDefinition {
    name: string;
    methods: RemoteMethodDefinitionMap;
};
