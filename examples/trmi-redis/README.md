# trmi-redis usage example

## Examples

This directory contains 2 example services which share the [common](common) package. 

[library-service](library-service) implements the LibraryService interface and exposes it with RedisRemoteServer.

[reader-service](reader-service) starts a simple express server and communicates with [library-service](library-service) via RedisRemoteClient.

### Prerequisites

- yarn `npm i -g yarn`
- Redis `docker run --name redis -d redis`

### Instructions

**Setup and start the library-service**

```sh
cd library-service
yarn install
yarn dev
```

**Setup and start the reader-service**

```sh
cd reader-service
yarn install
yarn dev
```

**Test the endpoints**

```sh
# Get all books
curl "http://127.0.0.1:3000/books"

# Add a book
curl -XPOST -H "Content-type: application/json" -d '{"id": "3", "name": "1984"}' 'http://127.0.0.1:3000/books'

# Delete a book
curl -XDELETE -H "Content-type: application/json" -d '{"id": "0"}' 'http://127.0.0.1:3000/books'
```
