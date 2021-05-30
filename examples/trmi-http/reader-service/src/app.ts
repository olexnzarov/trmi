import express from 'express';
import { HttpRemoteClient, TokenAuthenticationProvider } from 'trmi-http';
import { LibraryService } from '../../common/LibraryService';

const app = express();

app.use(express.json());

export const initialize = async () => {
    const remoteClient = HttpRemoteClient.create({
        url: 'http://127.0.0.1:3478',
        authentication: TokenAuthenticationProvider.create('VERY_SECRET_STRING'),
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
