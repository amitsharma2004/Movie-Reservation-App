import { Movie } from "./movie.model.js";
import logger from "../../utils/logger.js";
import { AsyncHandler } from "../../middlewares/globalErrorHandler.js";
import { ApiError } from "../../middlewares/globalErrorHandler.js";
import movieSchema from "./movie.validate.js";
import cloudinary from "../../config/cloudinary.js";
import esClient from "../../config/elastic_search.js";
import GenSeatsForMovie from "../../utils/gen_seats.js";
import { Ticket } from "../tickets/ticket.model.js";
import mongoose from "mongoose";

const DynamicPricing = async (movieId: string, seatCategory: string) => {
    const movie = await Movie.findById(movieId);
    if (!movie) return null;

    const showTime = movie.showTime;
    if (!showTime) return null; // Handle undefined showTime
    
    const now = new Date();
    const hoursLeft = (showTime.getTime() - now.getTime()) / (1000 * 60 * 60);

    // 1) BASE PRICE (from movie or seat model)
    let basePrice = movie.ticketPrice[seatCategory as keyof typeof movie.ticketPrice];

    // 2) TIME-BASED MULTIPLIER
    let timeMultiplier = 1;
    if (hoursLeft <= 1) timeMultiplier = 1.5;       // within 1 hour → +50%
    else if (hoursLeft <= 3) timeMultiplier = 1.3;  // within 3 hours → +30%
    else if (hoursLeft <= 6) timeMultiplier = 1.15; // within 6 hours → +15%

    // 3) DEMAND-BASED MULTIPLIER
    const totalSeats = movie.totalTickets[seatCategory as keyof typeof movie.totalTickets];
    const bookedTickets = await Ticket.find({
        movie: movieId,
        seatCategory: seatCategory,
        isSeatBooked: true
    } as any);
    const bookedCount = bookedTickets.length;
    const percentageFilled = bookedCount / totalSeats;

    let demandMultiplier = 1;
    if (percentageFilled >= 0.9) demandMultiplier = 1.4;   // 90%+ seats booked
    else if (percentageFilled >= 0.7) demandMultiplier = 1.25;
    else if (percentageFilled >= 0.5) demandMultiplier = 1.15;

    // 4) PEAK HOURS (optional)
    const hour = now.getHours();
    let peakMultiplier = 1;
    if (hour >= 18 && hour <= 22) peakMultiplier = 1.2; // evening peak

    // FINAL PRICE
    const finalPrice = basePrice * timeMultiplier * demandMultiplier * peakMultiplier;
    return Number(finalPrice.toFixed(2));
};

const AddMovieToDatabase = AsyncHandler (async (req: any, res: any) => {
    logger.info ('Adding movie to database');

    try {
        const { error, value } = movieSchema.validate(req.body);
        if (error) throw new ApiError (`${error.details[0].message}`, 400);

        const response = await cloudinary.uploader.upload(req.file?.path, {
            resource_type: "auto",
            folder: "movies",
            format: "webp",
            quality: "auto", 
        });
        
        const movie = new Movie({
            ...value,
            poster: response.secure_url,
            createdAt: new Date(),
            updatedAt: new Date(), // Fixed typo from updateAt
            totalTickets: value.totalTickets,
            totalTicketsSold: 0,
            totalRates: 0,
            comments: []
        });
        
        await movie.save();
        logger.info("movie is saved to database");

        // GenSeatsForMovie (movie, value.categories, value.price);
        return res.status(201).json({
            message: "Movie added successfully",
            movie,
            success: true,
            status: 201
        });
    } catch (error: any) {
        logger.error("Error adding movie to database", error);
        res.status(error.status || 500).json({
            message: error.message || "Internal Server Error",
            success: false,
            status: error.status || 500
        })
    }
});

const searchMovie = AsyncHandler (async (req: any, res: any) => {
    logger.info('searching for the movie');

    try {
        const { genre, title, cast, languages } = req.query;
        
        const userQuery = [genre, title, cast, languages].filter(Boolean) as string[];
        if (userQuery.length == 0) throw new ApiError ('at least one query parameter is required', 400);

        const searchQuery: object = {
            query: {
                multi_match: {
                    query: userQuery.join(" "),
                    fields: ["title", "genre", "cast", "languages"],
                    fuzziness: "AUTO",
                    type: "best_fields",
                    operator: "OR"
                }
            }
        }

        const searchResponse = await esClient.search({
            index: "movies",
            body: searchQuery
        })

        const movies = searchResponse?.hits?.hits.map((hit: any) => hit._source);

        res.status(200).json({
            message: 'Movies found',
            movies,
            success: true,
            status: 200
        })
    } catch (error: any) {
        logger.error("Error searching for movie", error);
        res.status(error.status || 500).json({
            message: error.message || "Internal Server Error",
            success: false,
            status: error.status || 500
        })
    }
});

const FetchNearByShows = AsyncHandler (async (req: any, res: any) => {
    logger.info('fetching near by shows');

    try {
        
    } catch (error) {
        
    }
})

export { 
    AddMovieToDatabase,
    searchMovie
};