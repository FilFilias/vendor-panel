import { createRedisSessionStorage} from 'remix-redis-session'
import Redis from "ioredis";


export const redisClient = new Redis(import.meta.env.VITE_REDIS_HOST || "redis://redis:6379");

export const sessionStorage = createRedisSessionStorage({
    cookie: {
        name: 'connect.sid',
        secure: import.meta.env.NODE_ENV == 'production' ? true : false,
        sameSite: "lax",
        secrets: ['secret'],
        path: "/",
        httpOnly: true,
    },
    options: {
        redisClient: redisClient

    }
});
