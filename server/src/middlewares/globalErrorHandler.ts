import logger from "../utils/logger.js";

export class ApiError extends Error {
    constructor(message: string, public statusCode: number) {
        super(message);
        this.statusCode = statusCode;
        this.name = 'ApiError';
        Object.setPrototypeOf(this, new.target.prototype);
        Error.captureStackTrace(this);
    }
}

const globalErrorHandler = (err: ApiError, _: any, res: any, __: any) => {
    logger.error(err.stack); 
    res.status(err.statusCode).json({ error: err.message });
}

export default globalErrorHandler;