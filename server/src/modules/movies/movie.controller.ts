import { Movie } from "./movie.model.js";
import logger from "../../utils/logger.js";
import { AsyncHandler } from "../../middlewares/globalErrorHandler.js";
import { ApiError } from "../../middlewares/globalErrorHandler.js";
import movieSchema from "./movie.validate.js";
import cloudinary from "../../config/cloudinary.js";
import esClient from "../../config/elastic_search.js";
import GenSeatsForMovie from "../../utils/gen_seats.js";

const DynamicPricing = async () => {
    const currentTime = new Date();
    const currentHour = currentTime.getHours();

    let priceMultiplier = 1;
    // pricemulipier based on time left for the show
    
}

const AddMovieToDatabase = AsyncHandler (async (req: any, res: any) => {
    logger.info ('Adding movie to database');

    try {
        const { error, value } = movieSchema.validate(req.body);
        if (error) throw new ApiError (`${error.details[0].message}`, 400);

        const response = cloudinary.uploader.upload(req.file?.path, {
            resource_type: "auto",
            folder: "movies",
            format: "webp",
            quality: "auto", 
        }).then((result) => {
            const movie = new Movie({
                ...value,
                poster: result.secure_url,
                createdAt: new Date(),
                updateAt: new Date(),
                totalTickets: value.ticketsRemaining
            })
            logger.info("movie is save to database");

            GenSeatsForMovie (movie, value.categories, value.price);
            return res.status(201).json({
                message: "Movie added successfully",
                movie,
                success: true,
                status: 201
            })
        })
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