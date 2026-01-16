import mongoose from 'mongoose';

interface ThreaterProps {
    name: string;
    location: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    capacity: number;
    screens: number;
    amenities?: string[];
    isActive: boolean;
    threaterLogo: string;
    contactNumber?: string;
    email?: string;
    description?: string;
    parkingAvailable?: boolean;
    foodCourtAvailable?: boolean;
    rating?: number;
    createdAt: Date;
    updatedAt: Date;
}

const threaterSchema = new mongoose.Schema<ThreaterProps>({
    name: {
        type: String,
        required: [true, 'Theater name is required'],
        trim: true,
        index: true,
    },
    location: {
        type: String,
        required: [true, 'Location is required'],
        trim: true,
    },
    address: {
        type: String,
        required: [true, 'Address is required'],
        trim: true,
    },
    city: {
        type: String,
        required: [true, 'City is required'],
        trim: true,
        index: true,
    },
    state: {
        type: String,
        required: [true, 'State is required'],
        trim: true,
    },
    zipCode: {
        type: String,
        required: [true, 'Zip code is required'],
        trim: true,
    },
    country: {
        type: String,
        required: [true, 'Country is required'],
        trim: true,
        default: 'India',
    },
    capacity: {
        type: Number,
        required: [true, 'Capacity is required'],
        min: [1, 'Capacity must be at least 1'],
    },
    screens: {
        type: Number,
        required: [true, 'Number of screens is required'],
        min: [1, 'Must have at least 1 screen'],
    },
    amenities: {
        type: [String],
        default: [],
    },
    isActive: {
        type: Boolean,
        default: true,
        index: true,
    },
    threaterLogo: {
        type: String,
        required: [true, 'Theater logo is required'],
    },
    contactNumber: {
        type: String,
        trim: true,
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
    },
    description: {
        type: String,
        trim: true,
        maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    parkingAvailable: {
        type: Boolean,
        default: false,
    },
    foodCourtAvailable: {
        type: Boolean,
        default: false,
    },
    rating: {
        type: Number,
        min: [0, 'Rating must be at least 0'],
        max: [5, 'Rating cannot exceed 5'],
        default: 0,
    },
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

threaterSchema.index({ city: 1, isActive: 1 });
threaterSchema.index({ name: 'text', location: 'text', city: 'text' });

export const Threater = mongoose.model<ThreaterProps>('Threater', threaterSchema);