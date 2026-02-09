import { createClient } from 'redis';
import logger from '../utils/logger.js';
import dotenv from 'dotenv';

dotenv.config();

const RedisClient = createClient({
    username: process.env.REDIS_USERNAME || 'default',
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
    }
});

RedisClient.on('error', (err) => {
    logger.error(`Redis error: ${err.message}`);
});

RedisClient.on('connect', () => {
    logger.info('Redis client connected');
});

RedisClient.on('ready', () => {
    logger.info('Redis client ready - Connected to Redis successfully');
});

RedisClient.on('end', () => {
    logger.info('Redis client disconnected');
});

const connectRedis = async () => {
    try {
        await RedisClient.connect();
        logger.info('Redis connection established');
    } catch (error: any) {
        logger.error(`Failed to connect to Redis: ${error.message}`);
        process.exit(1);
    }
};

connectRedis();

export { RedisClient };