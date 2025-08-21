# react-router-redis-session

A simple library to use redis as your session backing store in your react router (ex. remix) project

## Install

`npm install react-router-redis-session`

`yarn add react-router-redis-session`

`pnpm add react-router-redis-session`

## API

```ts
createRedisSessionStorage({
    cookie: SessionIdStorageStrategy["cookie"]
    options: {
        redisConfig?: Redis.RedisOptions,
        redisClient?: Redis.Redis
    }
})
```

## Examples

```ts
// With redisConfig
export const sessionStorage = createRedisSessionStorage({
    cookie: {
        name: "example",
        secure: true,
        sameSite: "lax",
        secrets: ["s3cr3t"],
        path: "/",
        httpOnly: true,
    },
    options: {
        redisConfig: {
            port: 6379,
            family: 6,
            host: process.env.REDIS_HOST,
            password: process.env.REDIS_PASSWORD ?? undefined,
        }
    }
});

// With redisClient
const redis = new Redis({
    port: 6379,
    family: 6,
    host: process.env.REDIS_HOST,
    password: process.env.REDIS_PASSWORD ?? undefined,
});

export const sessionStorage = createRedisSessionStorage({
    cookie: {
        name: "example",
        secure: true,
        sameSite: "lax",
        secrets: ["s3cr3t"],
        path: "/",
        httpOnly: true,
    },
    options: {
        redisClient: redis
    }
});
```

For typing the data inside the session you can pass two generics to `createRedisSessionStorage`.
See https://github.com/remix-run/react-router/blob/2b12d33024a136292e95cb2aebb00b1b5cb606d9/packages/react-router/lib/server-runtime/sessions.ts#L169

```ts

interface SessionData {
    user?: string;
}

export const sessionStorage = createRedisSessionStorage<SessionData>({
    ...
});



```
