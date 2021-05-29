export class RemoteCallTimeout extends Error {
    constructor() {
        super('Remote service call has timed out');
    }
};