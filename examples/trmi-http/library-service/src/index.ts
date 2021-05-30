import 'reflect-metadata';

import { HttpRemoteServer, TokenAuthenticationProvider } from 'trmi-http';
import { LibraryService } from './LibraryService';

const initialize = async () => {
    await HttpRemoteServer.create({
        port: 3478,
        authentication: TokenAuthenticationProvider.create('VERY_SECRET_STRING')
    })
    .from(LibraryService)
    .start();

    console.log('Started the application');
};

initialize()
    .catch((e) => console.error('Failed to start the application', e));