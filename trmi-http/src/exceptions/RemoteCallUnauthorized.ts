export class RemoteCallUnauthorized extends Error {
    constructor() {
        super('This remote call is unauthorized');
    }
};
