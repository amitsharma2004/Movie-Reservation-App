import mongoose from 'mongoose';

interface Ticket {
  title: string;
  price: number;
  userId: mongoose.Schema.Types.ObjectId;
  orderId: string;
  ticketExpiryDate: Date;
  status: "active" | "expired" | "cancelled" | "used";
  movie: mongoose.Schema.Types.ObjectId;
  paymentId: mongoose.Schema.Types.ObjectId;
  paymentStatus: "Pending" | "Success" | "Failed";
  theater: string;
  seatNumber: number;
  showTime: Date;
  address: string;
  isSeatBooked: boolean;
  isTicketActive: boolean;
  seatCategory: "Silver" | "Gold" | "Platinum";
}

const ticketSchema = new mongoose.Schema<Ticket>(
  {
    title: { type: String, required: true },

    price: { type: Number, required: true },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    orderId: { type: String, required: true },

    ticketExpiryDate: { type: Date, required: true },

    status: {
      type: String,
      required: true,
      enum: ["active", "expired", "cancelled", "used"],
      default: "active"
    },

    movie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Movie",
      required: true
    },

    paymentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
      required: true
    },

    paymentStatus: {
      type: String,
      enum: ["Pending", "Success", "Failed"],
      required: true,
      default: "Pending"
    },

    theater: { type: String, required: true },

    seatNumber: { type: Number, required: true },

    showTime: { type: Date, required: true },

    address: { type: String, required: true },

    isSeatBooked: {
      type: Boolean,
      required: true,
      default: false
    },

    isTicketActive: {
      type: Boolean,
      required: true,
      default: true
    },

    seatCategory: {
      type: String,
      enum: ["Silver", "Gold", "Platinum"],
      required: true,
      default: "Silver"
    }
  },
  {
    timestamps: true
  }
);

export const Ticket = mongoose.model<Ticket>("Ticket", ticketSchema);
