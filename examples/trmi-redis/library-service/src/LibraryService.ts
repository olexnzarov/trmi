import { Book, LibraryService as LibraryServiceSpecification } from '../../common/LibraryService';
import { RemoteService, RemoteMethod } from 'trmi-redis';

@RemoteService()
export class LibraryService implements LibraryServiceSpecification {
    private books: Book[] = [
        { id: '0', name: 'Don Quixote' },
        { id: '1', name: 'Fahrenheit 451' },
        { id: '2', name: 'The Little Prince' },
    ];

    @RemoteMethod()
    public async getBooks() {
        return this.books;
    }

    @RemoteMethod()
    public async addBook(book: Book) {
        if (typeof(book.id) != 'string' || typeof(book.name) != 'string') {
            throw new Error('Invalid book');
        }

        if (this.books.find(b => b.id === book.id)) {
            throw new Error('Book with this id already exists');
        }

        this.books.push(book);

        return book;
    }

    @RemoteMethod()
    public async removeBook(id: string) {
        const index = this.books.findIndex(b => b.id === id);

        if (index === -1) {
            throw new Error(`Book with id doesn't exist`);
        }

        this.books.splice(index, 1);
    }
};
