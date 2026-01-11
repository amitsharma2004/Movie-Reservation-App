import mongoose from "mongoose";

interface Payment {
    paymentId: string;
    amount: number;
    userId: mongoose.Types.ObjectId;
    movie: mongoose.Types.ObjectId;
    ticket: mongoose.Types.ObjectId;
    paymentMethod: string;
    currency: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
}

const paymentSchema = new mongoose.Schema<Payment>({
    paymentId: {
        type: String,
        required: true,
        unique: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    movie: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Movie',
        required: true,
    },
    ticket: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ticket',
        required: true,
    },
    paymentMethod: {
        type: String,
        required: true,
    },
    currency: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
    },
}, { timestamps: true });

export const Payment = mongoose.model<Payment>('Payment', paymentSchema);