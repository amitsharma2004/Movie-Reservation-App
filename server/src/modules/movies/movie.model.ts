import mongoose from "mongoose";

interface Movie {
    title: string;
    description: string;
    cast: string[];
    ticketPrice: {
        Silver: number;
        Gold: number;
        Platinum: number;
    };
    duration: number;
    ticketsRemaining: number;
    releaseDate: Date;
    languages: string[];
    genre: string;
    poster: string;
    video_url?: string;
    totalTickets: {
        Silver: number;
        Gold: number;
        Platinum: number;
    };
    totalTicketsSold: number;
    totalRates: number;
    comments: mongoose.Types.ObjectId[];
    showTime?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const movieSchema = new mongoose.Schema<Movie>({
    title: {
        type: String,
        required: [true, 'Movie title is required'],
        trim: true,
        minlength: [1, 'Title must be at least 1 character'],
        maxlength: [200, 'Title cannot exceed 200 characters'],
        index: true
    },
    description: {
        type: String,
        required: [true, 'Movie description is required'],
        trim: true,
        minlength: [10, 'Description must be at least 10 characters'],
        maxlength: [1000, 'Description cannot exceed 1000 characters']
    },
    cast: {
        type: [String],
        required: [true, 'Cast is required'],
        validate: {
            validator: (v: string[]) => v && v.length > 0,
            message: 'At least one cast member is required'
        }
    },
    duration: {
        type: Number,
        required: [true, 'Duration is required'],
        min: [1, 'Duration must be at least 1 minute'],
        max: [600, 'Duration cannot exceed 600 minutes']
    },
    ticketsRemaining: {
        type: Number,
        required: true,
        min: [0, 'Tickets remaining cannot be negative'],
        default: 0
    },
    releaseDate: {
        type: Date,
        required: [true, 'Release date is required']
    },
    languages: {
        type: [String],
        required: [true, 'Languages are required'],
        validate: {
            validator: (v: string[]) => v && v.length > 0,
            message: 'At least one language is required'
        }
    },
    genre: {
        type: String,
        required: [true, 'Genre is required'],
        enum: {
            values: ["Action", "Comedy", "Horror", "Romance", "Sci-Fi", "Drama", "Thriller", "Adventure", "Fantasy", "Animation"],
            message: '{VALUE} is not a valid genre'
        },
        index: true
    },
    poster: {
        type: String,
        required: [true, 'Poster is required'],
        default: 'default-poster-url'
    },
    video_url: {
        type: String,
        required: false
    },
    totalTickets: {
        Silver: {
            type: Number,
            required: true,
            min: [0, 'Silver tickets cannot be negative'],
            max: [1000, 'Silver tickets cannot exceed 1000']
        },
        Gold: {
            type: Number,
            required: true,
            min: [0, 'Gold tickets cannot be negative'],
            max: [1000, 'Gold tickets cannot exceed 1000']
        },
        Platinum: {
            type: Number,
            required: true,
            min: [0, 'Platinum tickets cannot be negative'],
            max: [1000, 'Platinum tickets cannot exceed 1000']
        }
    },
    totalTicketsSold: {
        type: Number,
        required: true,
        min: [0, 'Total tickets sold cannot be negative'],
        default: 0
    },
    totalRates: {
        type: Number,
        required: true,
        min: [0, 'Total rates cannot be negative'],
        default: 0
    },
    comments: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Comment',
        default: []
    },
    ticketPrice: {
        Silver: {
            type: Number,
            required: true,
            min: [1, 'Silver ticket price must be at least 1'],
            max: [10000, 'Silver ticket price cannot exceed 10000']
        },
        Gold: {
            type: Number,
            required: true,
            min: [1, 'Gold ticket price must be at least 1'],
            max: [10000, 'Gold ticket price cannot exceed 10000']
        },
        Platinum: {
            type: Number,
            required: true,
            min: [1, 'Platinum ticket price must be at least 1'],
            max: [10000, 'Platinum ticket price cannot exceed 10000']
        }
    },
    showTime: {
        type: Date,
        required: false
    }
}, {
    timestamps: true
});

// Indexes for better query performance
movieSchema.index({ title: 'text', genre: 'text', cast: 'text', languages: 'text' });
movieSchema.index({ releaseDate: -1 });
movieSchema.index({ showTime: 1 });

// Calculate tickets remaining before saving
movieSchema.pre('save', function(next: any) {
    if (this.isNew) {
        this.ticketsRemaining = this.totalTickets.Silver + this.totalTickets.Gold + this.totalTickets.Platinum;
    }
    next();
});

export const Movie = mongoose.model<Movie>("Movie", movieSchema);
