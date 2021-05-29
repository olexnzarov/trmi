import 'reflect-metadata';

import { RedisRemoteServer } from 'trmi-redis';
import { LibraryService } from "./LibraryService";

const initialize = async () => {
    await RedisRemoteServer.create({
        handshake: true,
        settings: {
            host: '127.0.0.1',
            port: 6379,
        },
    })
    .from(LibraryService)
    .start();

    console.log('Started the application');
};

initialize()
    .catch((e) => console.error('Failed to start the application', e));