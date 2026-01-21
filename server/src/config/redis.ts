import { createClient } from 'redis';
import logger from '../utils/logger.js';
import dotenv from 'dotenv';

dotenv.config();

const RedisClient = createClient({
    username: 'default',
    password: process.env.PASSWORD,
    socket: {
        host: process.env.HOST || 'localhost',
        port: 13279,
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