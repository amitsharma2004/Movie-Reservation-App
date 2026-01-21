import { Payment } from "./payment.model.js";
import { ApiError } from "../../middlewares/globalErrorHandler.js";
import { v4 as uuidv4 } from 'uuid';
import logger from "../../utils/logger.js";

interface CreatePaymentData {
    amount: number;
    userId: string;
    movieId: string;
    ticketId: string;
    paymentMethod: 'card' | 'upi' | 'netbanking' | 'wallet';
    currency?: string;
}

interface UpdatePaymentStatusData {
    status: 'Pending' | 'Confirmed' | 'Failed' | 'Refunded';
    transactionId?: string;
    failureReason?: string;
}

export const createPayment = async (data: CreatePaymentData) => {
    try {
        const paymentId = `PAY-${uuidv4()}`;

        const payment = new Payment({
            paymentId,
            amount: data.amount,
            userId: data.userId,
            movie: data.movieId,
            ticket: data.ticketId,
            paymentMethod: data.paymentMethod,
            currency: data.currency || 'INR',
            status: 'Pending',
        });

        await payment.save();
        return payment;
    } catch (error: any) {
        logger.error(`Error creating payment: ${error.message}`);
        throw new ApiError('Failed to create payment', 500);
    }
};

export const updatePaymentStatus = async (paymentId: string, data: UpdatePaymentStatusData) => {
    try {
        const payment = await Payment.findOne({ paymentId });
        
        if (!payment) {
            throw new ApiError('Payment not found', 404);
        }

        payment.status = data.status;
        
        if (data.transactionId) {
            payment.transactionId = data.transactionId;
        }
        
        if (data.failureReason) {
            payment.failureReason = data.failureReason;
        }

        await payment.save();
        return payment;
    } catch (error: any) {
        if (error instanceof ApiError) {
            throw error;
        }
        logger.error(`Error updating payment: ${error.message}`);
        throw new ApiError('Failed to update payment', 500);
    }
};

export const getPaymentById = async (paymentId: string) => {
    try {
        const payment = await Payment.findOne({ paymentId })
            .populate('userId', 'fullname email')
            .populate('movie', 'title')
            .populate('ticket');

        if (!payment) {
            throw new ApiError('Payment not found', 404);
        }

        return payment;
    } catch (error: any) {
        if (error instanceof ApiError) {
            throw error;
        }
        logger.error(`Error fetching payment: ${error.message}`);
        throw new ApiError('Failed to fetch payment', 500);
    }
};

export const getUserPayments = async (userId: string) => {
    try {
        const payments = await Payment.find({ userId })
            .populate('movie', 'title posterUrl')
            .populate('ticket')
            .sort({ createdAt: -1 });

        return payments;
    } catch (error: any) {
        logger.error(`Error fetching user payments: ${error.message}`);
        throw new ApiError('Failed to fetch user payments', 500);
    }
};
