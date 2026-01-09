import redis from 'redis';

const RedisClient = redis.createClient({
    url: 'redis://localhost:6379'
});

export { RedisClient };