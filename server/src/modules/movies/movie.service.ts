import { Movie } from "./movie.model.js";
import { AsyncHandler } from "../../middlewares/globalErrorHandler.js";
import logger from "../../utils/logger.js";
import { ApiError } from "../../middlewares/globalErrorHandler.js";

const GetAllMovies = AsyncHandler (async (req: any, res: any, _: any) => {
    try {
        const movies = await Movie.countDocuments();
        const moviesPerPage = 10;
        const totalPages = Math.ceil(movies / moviesPerPage);

        const perPageMovies = await Movie.find().limit(moviesPerPage);
        res.status(200).json({
            message: "All movies",
            movies: perPageMovies,
            totalPages: totalPages,
            success: true,
            status: 200
        })
    } catch (error: any) {
        logger.error("Error fetching movies", error);
        res.status(error.status || 500).json({
            message: error.message || "Internal Server Error",
            success: false,
            status: error.status || 500
        })
    }
});

const DeleteMovie = AsyncHandler(async (req: any, res: any) => {
    try {
        const movie = await Movie.findByIdAndDelete(req.params.id);
        if (!movie) throw new ApiError("Movie not found", 404);
        res.status(200).json({
            message: "Movie deleted successfully",
            success: true,
            status: 200
        })
    } catch (error: any) {
        logger.error('deleting movie with given id is failed, Try again');
        res.status(error.status || 500).json({
            message: error.message || 'Internal Server Error',
            status: error.status || 500,
            stack: error.stack || undefined,
            success: false
        })
    }
})

export { 
    GetAllMovies,
    DeleteMovie
};