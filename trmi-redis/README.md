# trmi-redis ![npm](https://img.shields.io/npm/v/trmi-redis)

This is a Redis Pub/Sub RMI implementation with a horizontal scaling support.

## Installation

```sh
yarn add trmi-redis
```

```sh
npm i trmi-redis
```

## Getting started

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
import { RemoteService, RemoteMethod } from 'trmi-redis';

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
import { RedisRemoteServer } from 'trmi-redis';

RedisRemoteServer.create({
        handshake: true,
        settings: {
            host: '127.0.0.1',
            port: 6379,
        },
    })
    .from(HelloWorld) // it is possible to pass varargs here
    .start()
    .catch(e => console.error('Failed to start a server', e));
```

**Start a remote client**

```ts
import { RedisRemoteServer } from 'trmi-redis';

const client = await RedisRemoteClient.create({
        handshake: 15000,
        settings: {
            host: '127.0.0.1',
            port: 6379,
        },
    }).start();

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

**Timeout**

Default response timeout is 30000 ms (30 seconds).

```ts
RedisRemoteClient.create({ timeout: 25000, ... });
```

This implementation also supports a handshake. It is similar to an ack-response in [Redisson Remote Services](https://github.com/redisson/redisson/wiki/9.-distributed-services). Before calling the remote service method, the server sends a handshake informing the client that it received a request. Because of this, it is possible to define 2 different timeouts: handshake and response timeout.

By default, handshakes are disabled. To enable them, you should pass a handshake property to both remote client and server.

```ts
RedisRemoteServer.create({ handshake: true, ... });
```

```ts
RedisRemoteClient.create({ handshake: 5000, ... });
```

## Implementation

Keep in mind that method params and return values are serialized/deserialized using `JSON.stringify/JSON.parse` functions and represented as objects. If you pass a class instance on one side, it will not become an instance of that class on the other side.

Each client and server creates 2 connections to the Redis. One is used for subscriptions and the other one is used for publishing the messages. Server is using locks to ensure that a remote call will only be called once, therefore  horizontal scaling is possible.