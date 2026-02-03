import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import corsOptions from './src/utils/cors.js';
import logger from './src/utils/logger.js';
<<<<<<< HEAD
import connectDB from './src/config/database.js';
=======
import { connectDB } from './src/config/database.js';
>>>>>>> 03a0756d5750b5ca0bd8ba9ccf78442336e7aff6
import syncMovies from './src/utils/syncMovies.js';
import MovieRouter from './src/modules/movies/movie.route.js';
import userRouter from './src/modules/auth/auth.routes.js';
import './src/config/redis.js'; // Import to initialize Redis connection
import rateLimit from './src/utils/rate_limiting.js';
import ThreaterRouter from './src/modules/threaters/threater.route.js';

dotenv.config();

const app = express();
<<<<<<< HEAD
connectDB();
=======
<<<<<<< HEAD
connectDB()
RedisClient.connect();
=======
connectDB();
>>>>>>> 03a0756d5750b5ca0bd8ba9ccf78442336e7aff6
>>>>>>> 82de17052c2ad03919e0d5f4f46362d91724bd38


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
<<<<<<< HEAD
// app.use('/api/tickets', rateLimit); // TODO: Implement ticket routes
=======
app.use('/api/tickets', rateLimit);
app.use('/api/theaters', ThreaterRouter);
>>>>>>> 03a0756d5750b5ca0bd8ba9ccf78442336e7aff6

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