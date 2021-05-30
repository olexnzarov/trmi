# trmi-http [![npm](https://img.shields.io/npm/v/trmi-http?label=trmi-http)](https://www.npmjs.com/package/trmi-http)

This is an HTTP RMI implementation based on [Fastify](https://github.com/fastify/fastify).

## Installation

```sh
yarn add trmi-http
```

```sh
npm i trmi-http
```

## Getting started

You can find a more detailed example [here](https://github.com/alexnzarov/trmi/tree/master/examples/trmi-http).

**Define and implement a remote service**

```ts
type HelloResponse = {
    message: string;
}

interface HelloWorldSpecification {
    hello(world: string): Promise<HelloResponse>;
    bye(): Promise<void>;
}
```

```ts
import { RemoteService, RemoteMethod } from 'trmi-http';

@RemoteService()
class HelloWorld implements HelloWorldSpecification {
    @RemoteMethod()
    async hello(world: string): Promise<HelloResponse> {
        return {
            message: `Hello ${world}!`,
        };
    }

    @RemoteMethod()
    async bye(): Promise<void> {
        throw new Error('"bye" method is not implemented');
    }
}
```

**Start a remote service server**

```ts
import { HttpRemoteServer } from 'trmi-http';

HttpRemoteServer.create({ port: 3478 })
    .from(HelloWorld) // it is possible to pass varargs here
    .start()
    .catch(e => console.error('Failed to start a server', e));
```

**Start a remote client**

```ts
import { HttpRemoteClient } from 'trmi-http';

const client = HttpRemoteClient.create({ url: 'http://127.0.0.1:3478' }).start();

const helloWorld = client.getService<HelloWorldSpecification>('HelloWorld');
const response = await helloWorld.hello('world');

console.log(response.message);

helloWorld.bye().catch(console.log);

```

## Configuration

**Remote service name**

By default, the remote service name defaults to the class name. You can override this behaviour by passing a name property. Characters `.~` are restricted as they are used in internal key generation.

```ts
@RemoteService({ name: 'MyServer_HelloWorld' })
class HelloWorld implements HelloWorldSpecification
```

```ts
client.getService<HelloWorldSpecification>('MyServer_HelloWorld');
```

**Authorization**

By default, server accepts requests from everywhere. You can change that by passing an AuthorizationProvider instance.

```ts
HttpRemoteServer.create({ authorization: TokenAuthorizationProvider.create('secret'), ... });
```

```ts
HttpRemoteClient.create({ authorization: TokenAuthorizationProvider.create('secret'), ... });
```

## Implementation

Server uses [Fastify](https://github.com/fastify/fastify) to receive requests from clients.

Client uses [got](https://github.com/sindresorhus/got) to send requests.