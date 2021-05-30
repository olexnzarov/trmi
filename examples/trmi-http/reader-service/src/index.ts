import 'reflect-metadata';

import { initialize } from './app';

const run = async () => {
    const app = await initialize();

    app.listen(3000, () => console.log('Listening on 127.0.0.1:3000'));
};

run();
