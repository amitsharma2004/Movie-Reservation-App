import mongoose from "mongoose";

interface Movie {
    title: string,
    description: string,
    cast: [string],
    duration: Date,
    ticketsRemaining: number,
    realease_date: Date,
    languages: [string],
    genre: string,
    poster: string,
    video_url?: string,
    createdAt: Date,
    updatedAt: Date
    totalTickets: number
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
        type: Date,
        required: true
    },
    ticketsRemaining: {
        type: Number,
        required: true
    },
    realease_date: {
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
        type: Number,
        required: true
    }
});

export const Movie = mongoose.model<Movie>("Movie", movieSchema);