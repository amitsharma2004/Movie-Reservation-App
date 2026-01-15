import mongoose from "mongoose";

interface Payment {
    paymentId: string;
    amount: number;
    userId: mongoose.Types.ObjectId;
    movie: mongoose.Types.ObjectId;
    ticket: mongoose.Types.ObjectId;
    paymentMethod: 'card' | 'upi' | 'netbanking' | 'wallet';
    currency: string;
    status: 'Pending' | 'Confirmed' | 'Failed' | 'Refunded';
    transactionId?: string;
    paymentGateway?: string;
    failureReason?: string;
    refundId?: string;
    refundAmount?: number;
    createdAt: Date;
    updatedAt: Date;
}

const paymentSchema = new mongoose.Schema<Payment>({
    paymentId: {
        type: String,
        required: [true, 'Payment ID is required'],
        unique: true,
        trim: true,
    },
    amount: {
        type: Number,
        required: [true, 'Amount is required'],
        min: [0, 'Amount must be positive'],
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User ID is required'],
        index: true,
    },
    movie: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Movie',
        required: [true, 'Movie ID is required'],
        index: true,
    },
    ticket: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ticket',
        required: [true, 'Ticket ID is required'],
        index: true,
    },
    paymentMethod: {
        type: String,
        required: [true, 'Payment method is required'],
        enum: {
            values: ['card', 'upi', 'netbanking', 'wallet'],
            message: '{VALUE} is not a valid payment method'
        },
    },
    currency: {
        type: String,
        required: [true, 'Currency is required'],
        default: 'INR',
        uppercase: true,
    },
    status: {
        type: String,
        required: [true, 'Payment status is required'],
        enum: {
            values: ['Pending', 'Confirmed', 'Failed', 'Refunded'],
            message: '{VALUE} is not a valid payment status'
        },
        default: 'Pending',
    },
    transactionId: {
        type: String,
        trim: true,
    },
    paymentGateway: {
        type: String,
        trim: true,
        default: 'Stripe',
    },
    failureReason: {
        type: String,
        trim: true,
    },
    refundId: {
        type: String,
        trim: true,
    },
    refundAmount: {
        type: Number,
        min: [0, 'Refund amount must be positive'],
    },
}, { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

paymentSchema.index({ userId: 1, createdAt: -1 });
paymentSchema.index({ status: 1, createdAt: -1 });

export const Payment = mongoose.model<Payment>('Payment', paymentSchema);