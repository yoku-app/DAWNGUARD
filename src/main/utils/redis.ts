import { FastifyInstance } from "fastify";
import { FastifyRedis } from "fastify-redis";

export interface RedisService {
    getClient: () => Promise<FastifyRedis>;
    getFromCache: <T>(key: string) => Promise<T | null>;
    setInCache: <T>(
        key: string,
        value: T,
        expiration?: number
    ) => Promise<void>;
    removeFromCache: (key: string) => Promise<void>;
}

export const redisService = (app: FastifyInstance): RedisService => {
    const getClient = async () => {
        return app.redis;
    };

    const getFromCache = async <T>(key: string): Promise<T | null> => {
        const jsonObject = await app.redis.get(key);

        if (!jsonObject) {
            return null;
        }

        return await JSON.parse(jsonObject);
    };

    const setInCache = async <T>(
        key: string,
        value: T,
        expiration?: number
    ) => {
        if (expiration) {
            await app.redis.set(key, JSON.stringify(value), "EX", expiration);
            return;
        }

        await app.redis.set(key, JSON.stringify(value));
    };

    const removeFromCache = async (key: string) => {
        await app.redis.del(key);
    };

    return {
        getClient,
        getFromCache,
        setInCache,
        removeFromCache,
    };
};
