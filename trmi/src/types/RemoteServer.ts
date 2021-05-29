import { Emitter } from './Emitter';

export interface RemoteServer<T> extends Emitter {
    get: () => T;
    from: (...services: Function[]) => this;
    start: () => this | Promise<this>;
};
