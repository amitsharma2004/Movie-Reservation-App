import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import corsOptions from './src/utils/cors.js';
import logger from './src/utils/logger.js';
import { connectDB } from './src/config/database.js';
import syncMovies from './src/utils/syncMovies.js';
import MovieRouter from './src/modules/movies/movie.route.js';
import userRouter from './src/modules/auth/auth.routes.js';
import { RedisClient } from './src/config/redis.js';
import rateLimit from './src/utils/rate_limiting.js';

dotenv.config();

const app = express();
connectDB()
RedisClient.connect();

RedisClient.on('connect', () => {
    logger.info(`Redis is running on: ${process.env.REDIS_URI}`);
})

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(corsOptions);

app.use((req: any, _: any, next: any) => {
    logger.info(`Request: ${req.method} ${req.url}`);
    next();
})

// Routes
app.get('/health', (_, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/movies', MovieRouter);
app.use('/api/auth', rateLimit, userRouter);
app.use('/api/tickets', rateLimit);

// Error Handler

// Server
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

server.on('error', (error: any) => {
    console.error('Server error:', error);
    process.exit(1);
});

process.on('SIGINT', () => {
    console.log('Server is closing');
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
});