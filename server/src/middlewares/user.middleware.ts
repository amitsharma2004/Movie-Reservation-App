import jwt from 'jsonwebtoken';
import { ApiError } from './globalErrorHandler.js';
import logger from '../utils/logger.js';

const verifyToken = (req: any, res: any, next: any) => {
    try {
        const token = req.cookies.accessToken || req.headers.authorization?.split(' ')[1];
        if (!token) throw new ApiError ('token not found', 404);

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'this is accessToken');
        req.user = decoded;
        next();
    } catch (error: any) {
        logger.error ('could not verify the user');
        res.status(error.status || 500).json({
            message: error.message || 'could not verify the user',
            success: false
        })
    }
}

export default verifyToken;