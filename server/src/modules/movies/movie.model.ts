import mongoose from "mongoose";

interface Movie {
    title: string,
    description: string,
    cast: [string],
    
    ticketPrice: {
        Silver: number,
        Gold: number,
        Platinum: number
    },
    duration: number, // in minutes
    ticketsRemaining: number,
    releaseDate: Date,
    languages: [string],
    genre: string,
    poster: string,
    video_url?: string,
    totalTickets: {
        Silver: number,
        Gold: number,
        Platinum: number
    },
    totalTicketsSold: number,
    totalRates: number,
    comments: mongoose.Types.ObjectId[],
    showTime?: Date
}

const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    cast: {
        type: [String],
        required: true
    },
    duration: {
        type: Number, // in minutes
        required: true
    },
    ticketsRemaining: {
        type: Number,
        required: true
    },
    releaseDate: {
        type: Date,
        required: true
    },
    languages: {
        type: [String],
        required: true
    },
    genre: {
        type: String,
        required: true
    },
    poster: {
        type: String,
        required: true
    },
    video_url: {
        type: String,
        required: false
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    totalTickets: {
        type: {
            Silver: Number,
            Gold: Number,
            Platinum: Number
        },
        required: true
    },
    totalTicketsSold: {
        type: Number,
        required: true
    },
    totalRates: {
        type: Number,
        required: true
    },
    comments: {
        type: [mongoose.Types.ObjectId],
        required: true
    },
    ticketPrice: {
        type: {
            Silver: { type: Number },
            Gold: { type: Number },
            Platinum: { type: Number }
        },
        required: true
    },
    showTime: {
        type: Date,
        required: false
    }
});

export const Movie = mongoose.model<Movie>("Movie", movieSchema);