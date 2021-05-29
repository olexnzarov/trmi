import { Emitter, EmitterCallback, EmitterEvent } from '../types/Emitter';

export class ClientEmitter<T = EmitterEvent> implements Emitter<T> {
    private events;

    protected constructor() {
        this.events = {};
    }

    public on(event: T, fn: EmitterCallback) {
        const fns = (this.events[event] ?? []);

        fns.push(fn);

        this.events[event] = fns;

        return this;
    }

    protected call(event: T, ...data: any[]) {
        const fns = this.events[event];

        if (fns == null || fns.length == 0) {
            return false;
        }

        for (const fn of fns) {
            fn(...data);
        }

        return true;
    }
};
