import { Payment } from "./payment.model.js";
import { ApiError } from "../../middlewares/globalErrorHandler.js";
import mongoose from "mongoose";
import logger from "../../utils/logger.js";

// Generate unique payment ID
export const generatePaymentId = (): string => {
    const timestamp = Date.now().toString(36);
    const randomStr = Math.random().toString(36).substring(2, 9);
    return `PAY-${timestamp}-${randomStr}`.toUpperCase();
};

// Create a new payment
export const createPayment = async (paymentData: {
    amount: number;
    userId: string;
    movieId: string;
    ticketId: string;
    paymentMethod: 'card' | 'upi' | 'netbanking' | 'wallet';
    currency?: string;
}) => {
    const paymentId = generatePaymentId();

    const payment = new Payment({
        paymentId,
        amount: paymentData.amount,
        userId: new mongoose.Types.ObjectId(paymentData.userId),
        movie: new mongoose.Types.ObjectId(paymentData.movieId),
        ticket: new mongoose.Types.ObjectId(paymentData.ticketId),
        paymentMethod: paymentData.paymentMethod,
        currency: paymentData.currency || 'INR',
        status: 'Pending',
    });

    await payment.save();
    logger.info(`Payment created: ${paymentId}`);
    return payment;
};

// Update payment status
export const updatePaymentStatus = async (
    paymentId: string,
    updateData: {
        status: 'Pending' | 'Confirmed' | 'Failed' | 'Refunded';
        transactionId?: string;
        failureReason?: string;
    }
) => {
    const payment = await Payment.findOne({ paymentId });
    
    if (!payment) {
        throw new ApiError('Payment not found', 404);
    }

    payment.status = updateData.status;
    
    if (updateData.transactionId) {
        payment.transactionId = updateData.transactionId;
    }
    
    if (updateData.failureReason) {
        payment.failureReason = updateData.failureReason;
    }

    await payment.save();
    logger.info(`Payment ${paymentId} status updated to ${updateData.status}`);
    return payment;
};

// Get payment by ID
export const getPaymentById = async (paymentId: string) => {
    const payment = await Payment.findOne({ paymentId })
        .populate('userId', 'fullname email')
        .populate('movie', 'title')
        .populate('ticket');
    
    if (!payment) {
        throw new ApiError('Payment not found', 404);
    }
    
    return payment;
};

// Get user payments
export const getUserPayments = async (userId: string) => {
    const payments = await Payment.find({ userId: new mongoose.Types.ObjectId(userId) })
        .populate('movie', 'title poster')
        .populate('ticket')
        .sort({ createdAt: -1 });
    
    return payments;
};

export default {
    createPayment,
    updatePaymentStatus,
    getPaymentById,
    getUserPayments,
    generatePaymentId
};
