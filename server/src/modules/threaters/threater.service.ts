import { Threater } from "./threater.model.js";
import { ApiError } from "../../middlewares/globalErrorHandler.js";
import logger from "../../utils/logger.js";

interface CreateTheaterData {
    name: string;
    location: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country?: string;
    capacity: number;
    screens: number;
    amenities?: string[];
    isActive?: boolean;
    threaterLogo: string;
    contactNumber?: string;
    email?: string;
    description?: string;
    parkingAvailable?: boolean;
    foodCourtAvailable?: boolean;
    rating?: number;
}

interface UpdateTheaterData {
    name?: string;
    location?: string;
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
    capacity?: number;
    screens?: number;
    amenities?: string[];
    isActive?: boolean;
    threaterLogo?: string;
    contactNumber?: string;
    email?: string;
    description?: string;
    parkingAvailable?: boolean;
    foodCourtAvailable?: boolean;
    rating?: number;
}

export const createTheater = async (data: CreateTheaterData) => {
    try {
        const existingTheater = await Threater.findOne({ 
            name: data.name, 
            city: data.city 
        });

        if (existingTheater) {
            throw new ApiError('Theater with this name already exists in this city', 409);
        }

        const theater = new Threater(data);
        await theater.save();
        return theater;
    } catch (error: any) {
        if (error instanceof ApiError) {
            throw error;
        }
        logger.error(`Error creating theater: ${error.message}`);
        throw new ApiError('Failed to create theater', 500);
    }
};

export const updateTheater = async (theaterId: string, data: UpdateTheaterData) => {
    try {
        const theater = await Threater.findById(theaterId);

        if (!theater) {
            throw new ApiError('Theater not found', 404);
        }

        Object.assign(theater, data);
        await theater.save();
        return theater;
    } catch (error: any) {
        if (error instanceof ApiError) {
            throw error;
        }
        logger.error(`Error updating theater: ${error.message}`);
        throw new ApiError('Failed to update theater', 500);
    }
};

export const getTheaterById = async (theaterId: string) => {
    try {
        const theater = await Threater.findById(theaterId);

        if (!theater) {
            throw new ApiError('Theater not found', 404);
        }

        return theater;
    } catch (error: any) {
        if (error instanceof ApiError) {
            throw error;
        }
        logger.error(`Error fetching theater: ${error.message}`);
        throw new ApiError('Failed to fetch theater', 500);
    }
};

export const getAllTheaters = async (filters?: { city?: string; isActive?: boolean }) => {
    try {
        const query: any = {};

        if (filters?.city) {
            query.city = new RegExp(filters.city, 'i');
        }

        if (filters?.isActive !== undefined) {
            query.isActive = filters.isActive;
        }

        const theaters = await Threater.find(query).sort({ createdAt: -1 });
        return theaters;
    } catch (error: any) {
        logger.error(`Error fetching theaters: ${error.message}`);
        throw new ApiError('Failed to fetch theaters', 500);
    }
};

export const deleteTheater = async (theaterId: string) => {
    try {
        const theater = await Threater.findById(theaterId);

        if (!theater) {
            throw new ApiError('Theater not found', 404);
        }

        await theater.deleteOne();
        return theater;
    } catch (error: any) {
        if (error instanceof ApiError) {
            throw error;
        }
        logger.error(`Error deleting theater: ${error.message}`);
        throw new ApiError('Failed to delete theater', 500);
    }
};

export const searchTheaters = async (searchTerm: string) => {
    try {
        const theaters = await Threater.find({
            $text: { $search: searchTerm },
            isActive: true
        }).sort({ rating: -1 });

        return theaters;
    } catch (error: any) {
        logger.error(`Error searching theaters: ${error.message}`);
        throw new ApiError('Failed to search theaters', 500);
    }
};
