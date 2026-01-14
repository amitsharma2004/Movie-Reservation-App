import logger from "../utils/logger.js";
import { Request, Response, NextFunction } from 'express';

export class ApiError extends Error {
    public readonly statusCode: number;
    public readonly isOperational: boolean;

    constructor(message: string, statusCode: number, isOperational = true) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        this.name = 'ApiError';
        Object.setPrototypeOf(this, new.target.prototype);
        Error.captureStackTrace(this);
    }
}

const globalErrorHandler = (err: ApiError | Error, _req: Request, res: Response, _next: NextFunction) => {
    if (err instanceof ApiError) {
        logger.error(`ApiError: ${err.message}`, { statusCode: err.statusCode, stack: err.stack });
        res.status(err.statusCode).json({
            success: false,
            message: err.message,
            statusCode: err.statusCode
        });
    } else {
        logger.error(`Unexpected Error: ${err.message}`, { stack: err.stack });
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            statusCode: 500
        });
    }
};

export const AsyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) => {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};

export default globalErrorHandler;