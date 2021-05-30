export interface Book {
    id: string;
    name: string;
};

export interface LibraryService {
    getBooks(): Promise<Book[]>;
    addBook(book: Book): Promise<Book>;
    removeBook(id: string): Promise<void>
};
