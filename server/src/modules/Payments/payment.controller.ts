import logger from "../../utils/logger.js";
import { ApiError, AsyncHandler } from "../../middlewares/globalErrorHandler.js";
import { AuthRequest } from "../../middlewares/user.middleware.js";
import { Response } from "express";
import { createPaymentSchema, updatePaymentStatusSchema } from "./payment.validate.js";
import * as paymentService from "./payment.service.js";

// Create a new payment
const createPayment = AsyncHandler(async (req: any, res: Response) => {
    const authRequest = req as AuthRequest;
    logger.info('Creating new payment...');

    const { error, value } = createPaymentSchema.validate(authRequest.body, { abortEarly: false });
    if (error) {
        const errorMessages = error.details.map(detail => detail.message).join(', ');
        throw new ApiError(errorMessages, 400);
    }

    if (!authRequest.userId) {
        throw new ApiError('User not authenticated', 401);
    }

    const payment = await paymentService.createPayment({
        amount: value.amount,
        userId: authRequest.userId,
        movieId: value.movieId,
        ticketId: value.ticketId,
        paymentMethod: value.paymentMethod,
        currency: value.currency,
    });

    logger.info(`Payment created successfully: ${payment.paymentId}`);
    res.status(201).json({
        success: true,
        message: 'Payment created successfully',
        statusCode: 201,
        data: { payment }
    });
});

// Update payment status
const updatePayment = AsyncHandler(async (req: any, res: Response) => {
    const authRequest = req as AuthRequest;
    logger.info('Updating payment status...');

    const { paymentId } = authRequest.params;
    
    if (!paymentId) {
        throw new ApiError('Payment ID is required', 400);
    }

    const { error, value } = updatePaymentStatusSchema.validate(authRequest.body, { abortEarly: false });
    if (error) {
        const errorMessages = error.details.map(detail => detail.message).join(', ');
        throw new ApiError(errorMessages, 400);
    }

    const payment = await paymentService.updatePaymentStatus(paymentId, {
        status: value.status,
        transactionId: value.transactionId,
        failureReason: value.failureReason,
    });

    logger.info(`Payment ${paymentId} updated successfully`);
    res.status(200).json({
        success: true,
        message: 'Payment status updated successfully',
        statusCode: 200,
        data: { payment }
    });
});

// Get payment by ID
const getPayment = AsyncHandler(async (req: any, res: Response) => {
    const authRequest = req as AuthRequest;
    logger.info('Fetching payment details...');

    const { paymentId } = authRequest.params;
    
    if (!paymentId) {
        throw new ApiError('Payment ID is required', 400);
    }

    const payment = await paymentService.getPaymentById(paymentId);

    logger.info(`Payment ${paymentId} fetched successfully`);
    res.status(200).json({
        success: true,
        message: 'Payment fetched successfully',
        statusCode: 200,
        data: { payment }
    });
});

// Get user payments
const getUserPayments = AsyncHandler(async (req: any, res: Response) => {
    const authRequest = req as AuthRequest;
    logger.info('Fetching user payments...');

    if (!authRequest.userId) {
        throw new ApiError('User not authenticated', 401);
    }

    const payments = await paymentService.getUserPayments(authRequest.userId);

    logger.info(`Fetched ${payments.length} payments for user ${authRequest.userId}`);
    res.status(200).json({
        success: true,
        message: 'User payments fetched successfully',
        statusCode: 200,
        data: { payments, count: payments.length }
    });
});

export {
    createPayment,
    updatePayment,
    getPayment,
    getUserPayments
};