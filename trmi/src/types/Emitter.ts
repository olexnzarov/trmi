export type EmitterEvent = 'error';

export type EmitterCallback = (...data: any[]) => void;

export interface Emitter<T = EmitterEvent> {
    on(event: T, fn: EmitterCallback): this;
};
