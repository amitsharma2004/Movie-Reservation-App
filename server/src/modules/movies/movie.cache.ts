import { RedisClient } from "../../config/redis.js";
import logger from "../../utils/logger.js";

const GetCachedMovies = async (key: string) => {
    try {
        const cachedMovies: any = await RedisClient.get(key);
        if (cachedMovies) {
            return JSON.parse(cachedMovies);
        }
    } catch (error: any) {
        logger.error(error.message);
    }
}

const SetCatchedMovies = async (key: string, value: any, ttl = 3600) => {
    await RedisClient.setEx(key, ttl, JSON.stringify(value));
}

export {
    GetCachedMovies, SetCatchedMovies
};