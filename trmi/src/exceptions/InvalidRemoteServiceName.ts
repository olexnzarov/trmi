export class InvalidRemoteServiceName extends Error {
    constructor(name: string) {
        super(`Remote service name cannot include following characters: .~ (got "${name}")`);
    }
};