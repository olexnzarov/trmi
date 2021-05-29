export class RemoteServiceDuplication extends Error {
    constructor(name: string) {
        super(`Remote service with this name already exists - ${name}`);
    }
};