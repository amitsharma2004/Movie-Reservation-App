import jwt from 'jsonwebtoken';
import { ApiError } from './globalErrorHandler.js';
import logger from '../utils/logger.js';
import { Request, Response, NextFunction } from 'express';

export interface AuthRequest extends Request {
    userId: string;
    role: string;
}

interface JwtPayload {
    id: string;
    role: string;
    iat?: number;
    exp?: number;
}

const extractToken = (req: Request): string | null => {
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith('Bearer ')) {
        return authHeader.substring(7);
    }
    return req.cookies?.accessToken || null;
};

const verifyToken = (req: Request, res: Response, next: NextFunction): void => {
    try {
        const token = extractToken(req);
        
        if (!token) {
            throw new ApiError('Authentication token not found', 401);
        }

        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            logger.error('JWT_SECRET is not configured');
            throw new ApiError('Server configuration error', 500);
        }

        const decoded = jwt.verify(token, jwtSecret) as JwtPayload;
        
        (req as AuthRequest).userId = decoded.id;
        (req as AuthRequest).role = decoded.role || 'user';
        
        next();
    } catch (error: any) {
        if (error instanceof jwt.JsonWebTokenError) {
            logger.error('Invalid token:', error.message);
            res.status(401).json({
                message: 'Invalid or expired token',
                success: false,
                statusCode: 401
            });
            return;
        } else if (error instanceof ApiError) {
            logger.error('Authentication error:', error.message);
            res.status(error.statusCode).json({
                message: error.message,
                success: false,
                statusCode: error.statusCode
            });
            return;
        } else {
            logger.error('Token verification failed:', error);
            res.status(500).json({
                message: 'Could not verify the user',
                success: false,
                statusCode: 500
            });
            return;
        }
    }
};

const verifyAdmin = (req: Request, res: Response, next: NextFunction): void => {
    try {
        const token = extractToken(req);
        
        if (!token) {
            throw new ApiError('Authentication token not found', 401);
        }

        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            logger.error('JWT_SECRET is not configured');
            throw new ApiError('Server configuration error', 500);
        }

        const decoded = jwt.verify(token, jwtSecret) as JwtPayload;
        
        if (decoded.role !== 'admin') {
            throw new ApiError('Access denied. Admin privileges required', 403);
        }
        
        (req as AuthRequest).userId = decoded.id;
        (req as AuthRequest).role = decoded.role;
        
        next();
    } catch (error: any) {
        if (error instanceof jwt.JsonWebTokenError) {
            logger.error('Invalid token:', error.message);
            res.status(401).json({
                message: 'Invalid or expired token',
                success: false,
                statusCode: 401
            });
            return;
        } else if (error instanceof ApiError) {
            logger.error('Admin verification failed:', error.message);
            res.status(error.statusCode).json({
                message: error.message,
                success: false,
                statusCode: error.statusCode
            });
            return;
        } else {
            logger.error('Admin verification error:', error);
            res.status(500).json({
                message: 'Verifying user role failed',
                success: false,
                statusCode: 500
            });
            return;
        }
    }
};

export {
    verifyAdmin,
    verifyToken
};
