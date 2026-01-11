import { Movie } from "./movie.model.js";
import { AsyncHandler, ApiError } from "../../middlewares/globalErrorHandler.js";
import logger from "../../utils/logger.js";

export const GetAllMovies = AsyncHandler(async (req: any, res: any) => {
  const page = Number(req.query.page) || 1;
  const moviesPerPage = 10;

  const totalMovies = await Movie.countDocuments();
  const totalPages = Math.ceil(totalMovies / moviesPerPage);

  const movies = await Movie.find()
    .sort({ createdAt: -1 })   // latest first
    .skip((page - 1) * moviesPerPage)
    .limit(moviesPerPage);

  return res.status(200).json({
    message: "Movies fetched successfully",
    success: true,
    movies,
    page,
    totalPages
  });
});

export const DeleteMovie = AsyncHandler(async (req: any, res: any) => {
  const movie = await Movie.findByIdAndDelete(req.params.id);

  if (!movie) throw new ApiError("Movie not found", 404);

  logger.info(`Movie deleted: ${req.params.id}`);

  return res.status(200).json({
    message: "Movie deleted successfully",
    success: true
  });
});
