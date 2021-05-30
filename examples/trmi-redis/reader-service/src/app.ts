import express from 'express';
import { RedisRemoteClient } from 'trmi-redis';
import { LibraryService } from '../../common/LibraryService';

const app = express();

app.use(express.json());

export const initialize = async () => {
    const remoteClient = await RedisRemoteClient.create({
        handshake: 5000,
        settings: {
            host: '127.0.0.1',
            port: 6379,
        },
    }).start();

    const libraryService = remoteClient.getService<LibraryService>('LibraryService');

    app.get('/books', async (_, res) => {
        const books = await libraryService.getBooks();
        res.json(books);
    });

    app.post('/books', async ({ body }, res) => {
        console.log(body);
        try {
            const book = await libraryService.addBook(body);
            res.json(book);
        } catch (e) {
            res.status(400).json({ error: e.toString() });
        }
    });

    app.delete('/books', async ({ body }, res) => {
        try {
            await libraryService.removeBook(body.id);

            res.send();
        } catch (e) {
            res.status(400).json({ error: e.toString() });
        }
    });

    return app;
};
