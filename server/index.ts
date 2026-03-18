import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import logger from './src/utils/logger.js';
import MovieRouter from './src/modules/movies/movie.route.js';
import authRouter from './src/modules/auth/auth.routes.js';
import './src/config/redis.js'; // Import to initialize Redis connection
import rateLimit from './src/utils/rate_limiting.js';
import ThreaterRouter from './src/modules/threaters/threater.route.js';
import corsOptions from './src/utils/cors.js';
import { dbConnect } from './src/config/database.js';
import { initializeCronJobs } from './src/utils/cron.js';
import './src/modules/comments/comment.model.js';
import { seedMovies } from './src/utils/seedMovies.js';

dotenv.config();

const app = express();
await dbConnect();

await seedMovies ();

// Initialize cron jobs
initializeCronJobs();

// CORS - Must be before other middleware
app.use(corsOptions);

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));


// Serve static files from uploads directory
app.use('/uploads', express.static('uploads'));

app.use((req: Request, _res: Response, next: NextFunction) => {
    logger.info(`Request: ${req.method}: ${req.url}`);
    next();
})

// Routes
app.get('/health', (_req: Request, res: Response) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/movies', MovieRouter);
app.use('/api/auth', rateLimit, authRouter);
app.use('/api/tickets', rateLimit);
app.use('/api/theaters', ThreaterRouter);

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
