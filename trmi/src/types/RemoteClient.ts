import { Emitter } from './Emitter';

export interface RemoteClient extends Emitter {
    start(): this | Promise<this>;
    getService<T>(name: string): T;
};