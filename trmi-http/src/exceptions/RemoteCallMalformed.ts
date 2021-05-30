export class RemoteCallMalformed extends Error {
    constructor() {
        super('This remote call is malformed');
    }
};
