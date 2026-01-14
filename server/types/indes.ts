import { Request, Response } from 'express';

export interface AuthRequest extends Request {
    userId: string,
    role: string
};

export interface ApiResponse extends Response {
    message: string,
    success: boolean,
    statusCode: number,
    data: any
};