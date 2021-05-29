import { RemoteCallTimeout } from 'trmi';

export class TrackedPromise {
    private promise: Promise<unknown>;
    private resolved: boolean;

    public resolve: (v: any) => void;
    public reject: (e: any) => void;

    private constructor() {
        this.resolved = false;

        this.promise = new Promise(
            (resolve, reject) => {
                this.resolve = (v) => {
                    if (this.resolved) { return; }

                    this.resolved = true;

                    resolve(v);
                };
                this.reject = (e) => {
                    if (this.resolved) { return; }

                    this.resolved = true;

                    reject(e);
                };
            }
        );
    }

    public timeout() {
        this.reject(new RemoteCallTimeout());
    }

    public get() {
        return this.promise;
    }

    public static create() {
        return new TrackedPromise();
    }
};