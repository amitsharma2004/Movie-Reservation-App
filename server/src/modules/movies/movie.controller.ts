import { Request, Response } from 'express';
import { Movie } from "./movie.model.js";
import logger from "../../utils/logger.js";
import { AsyncHandler, ApiError } from "../../middlewares/globalErrorHandler.js";
import movieSchema from "./movie.validate.js";
import cloudinary from "../../config/cloudinary.js";
import esClient from "../../config/elastic_search.js";
import GenSeatsForMovie from "../../utils/gen_seats.js";
import { Ticket } from "../tickets/ticket.model.js";

interface DynamicPricingParams {
    movieId: string;
    seatCategory: 'Silver' | 'Gold' | 'Platinum';
}

export const DynamicPricing = async (movieId: string, seatCategory: 'Silver' | 'Gold' | 'Platinum'): Promise<number | null> => {
    try {
        const movie = await Movie.findById(movieId);
        if (!movie) {
            logger.warn(`Movie not found for dynamic pricing: ${movieId}`);
            return null;
        }

        const showTime = movie.showTime;
        if (!showTime) {
            logger.warn(`Show time not set for movie: ${movieId}`);
            return null;
        }
        
        const now = new Date();
        const hoursLeft = (showTime.getTime() - now.getTime()) / (1000 * 60 * 60);

        // Base price from movie
        const basePrice = movie.ticketPrice[seatCategory];
        if (!basePrice) {
            logger.error(`Invalid seat category: ${seatCategory}`);
            return null;
        }

        // Time-based multiplier
        let timeMultiplier = 1;
        if (hoursLeft <= 1) timeMultiplier = 1.5;
        else if (hoursLeft <= 3) timeMultiplier = 1.3;
        else if (hoursLeft <= 6) timeMultiplier = 1.15;

        // Demand-based multiplier
        const totalSeats = movie.totalTickets[seatCategory];
        const bookedTickets = await Ticket.countDocuments({
            movie: movieId as any,
            seatCategory: seatCategory,
            isSeatBooked: true
        } as any);
        
        const percentageFilled = bookedTickets / totalSeats;

        let demandMultiplier = 1;
        if (percentageFilled >= 0.9) demandMultiplier = 1.4;
        else if (percentageFilled >= 0.7) demandMultiplier = 1.25;
        else if (percentageFilled >= 0.5) demandMultiplier = 1.15;

        // Peak hours multiplier
        const hour = now.getHours();
        const peakMultiplier = (hour >= 18 && hour <= 22) ? 1.2 : 1;

        // Calculate final price
        const finalPrice = basePrice * timeMultiplier * demandMultiplier * peakMultiplier;
        return Number(finalPrice.toFixed(2));
    } catch (error: any) {
        logger.error('Error calculating dynamic pricing:', error);
        return null;
    }
};

const AddMovieToDatabase = AsyncHandler(async (req: Request, res: Response) => {
    logger.info('Adding movie to database');

    const { error, value } = movieSchema.validate(req.body, { abortEarly: false });
    if (error) {
        const errorMessages = error.details.map(detail => detail.message).join(', ');
        throw new ApiError(errorMessages, 400);
    }

    // Check if movie already exists
    const existingMovie = await Movie.findOne({ title: value.title, releaseDate: value.releaseDate });
    if (existingMovie) {
        throw new ApiError('Movie with this title and release date already exists', 409);
    }

    let posterUrl = 'default-poster-url';
    
    // Upload poster to cloudinary if file is provided
    if (req.file?.path) {
        try {
            const response = await cloudinary.uploader.upload(req.file.path, {
                resource_type: "auto",
                folder: "movies",
                format: "webp",
                quality: "auto",
                transformation: [
                    { width: 800, height: 1200, crop: "limit" }
                ]
            });
            posterUrl = response.secure_url;
        } catch (uploadError: any) {
            logger.error('Error uploading poster to cloudinary:', uploadError);
            throw new ApiError('Failed to upload movie poster', 500);
        }
    }

    const movie = new Movie({
        title: value.title,
        description: value.description,
        cast: value.cast,
        duration: value.duration,
        releaseDate: value.releaseDate,
        languages: value.languages,
        genre: value.genre,
        poster: posterUrl,
        video_url: value.video_url,
        totalTickets: value.totalTickets,
        ticketPrice: value.ticketPrice,
        showTime: value.showTime,
        totalTicketsSold: 0,
        totalRates: 0,
        comments: []
    });
    
    await movie.save();
    logger.info(`Movie saved to database: ${movie.title} (ID: ${movie._id})`);

    // Generate seats for the movie
    try {
        await GenSeatsForMovie(movie, value.totalTickets, value.ticketPrice);
        logger.info(`Seats generated for movie: ${movie._id}`);
    } catch (seatError: any) {
        logger.error('Error generating seats:', seatError);
        // Don't fail the request if seat generation fails
    }

    res.status(201).json({
        success: true,
        message: 'Movie added successfully',
        statusCode: 201,
        data: { movie }
    });
});

const searchMovie = AsyncHandler(async (req: Request, res: Response) => {
    logger.info('Searching for movies');

    const { genre, title, cast, languages } = req.query;
    
    const queryParams = [genre, title, cast, languages].filter(Boolean) as string[];
    
    if (queryParams.length === 0) {
        throw new ApiError('At least one search parameter is required (genre, title, cast, or languages)', 400);
    }

    try {
        const searchQuery = {
            query: {
                multi_match: {
                    query: queryParams.join(" "),
                    fields: ["title^3", "genre^2", "cast", "languages"],
                    fuzziness: "AUTO",
                    type: "best_fields",
                    operator: "OR"
                }
            }
        };

        const searchResponse = await esClient.search({
            index: "movies",
            body: searchQuery
        } as any);

        const movies = searchResponse?.hits?.hits.map((hit: any) => ({
            ...hit._source,
            _score: hit._score
        })) || [];

        logger.info(`Found ${movies.length} movies matching search criteria`);

        res.status(200).json({
            success: true,
            message: movies.length > 0 ? 'Movies found' : 'No movies found matching your search',
            statusCode: 200,
            data: {
                movies,
                count: movies.length
            }
        });
    } catch (esError: any) {
        logger.error('Elasticsearch error:', esError);
        
        // Fallback to MongoDB search if Elasticsearch fails
        const fallbackQuery: any = {};
        
        if (title) fallbackQuery.title = { $regex: title, $options: 'i' };
        if (genre) fallbackQuery.genre = { $regex: genre, $options: 'i' };
        if (cast) fallbackQuery.cast = { $in: [new RegExp(cast as string, 'i')] };
        if (languages) fallbackQuery.languages = { $in: [new RegExp(languages as string, 'i')] };

        const movies = await Movie.find(fallbackQuery).limit(50);

        logger.info(`Fallback search found ${movies.length} movies`);

        res.status(200).json({
            success: true,
            message: movies.length > 0 ? 'Movies found (fallback search)' : 'No movies found matching your search',
            statusCode: 200,
            data: {
                movies,
                count: movies.length
            }
        });
    }
});

const FetchNearByShows = AsyncHandler(async (req: Request, res: Response) => {
    logger.info('Fetching nearby shows');

    const { latitude, longitude, radius = 10 } = req.query;

    if (!latitude || !longitude) {
        throw new ApiError('Latitude and longitude are required', 400);
    }

    const lat = parseFloat(latitude as string);
    const lon = parseFloat(longitude as string);
    const radiusKm = parseFloat(radius as string);

    if (isNaN(lat) || isNaN(lon) || isNaN(radiusKm)) {
        throw new ApiError('Invalid coordinates or radius', 400);
    }

    // TODO: Implement geospatial query when theater location data is available
    throw new ApiError('Nearby shows feature is not yet implemented', 501);
});

export { 
    AddMovieToDatabase,
    searchMovie,
    FetchNearByShows
};
