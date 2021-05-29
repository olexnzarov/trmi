export class RemoteServiceMissing extends Error {
    constructor(name: string) {
        super(`Remote service doesn't exist - ${name}`);
    }
};