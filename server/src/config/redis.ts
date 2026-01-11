import redis from 'redis';
import logger from '../utils/logger.js';
import dotenv from 'dotenv';

dotenv.config();

const isProd = process.env.PRODUCTION === "true";

const RedisClient = redis.createClient(
    isProd
        ? {
            username: process.env.USERNAME || undefined,
            password: process.env.PASSWORD,
            socket: {
                host: process.env.HOST,
                port: Number(process.env.PORT)
            },
            database: Number(process.env.DATABASE) || 0
        }
        : {
            url: process.env.REDIS_URL
        }
);

RedisClient.on('error', err => logger.error(err.message));
RedisClient.on('ready', () => logger.info("Connected to Redis successfully"));


export { RedisClient }