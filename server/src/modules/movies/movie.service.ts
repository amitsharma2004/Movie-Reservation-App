import { Request, Response } from 'express';
import { Movie } from "./movie.model.js";
import { AsyncHandler, ApiError } from "../../middlewares/globalErrorHandler.js";
import logger from "../../utils/logger.js";

export const GetAllMovies = AsyncHandler(async (req: Request, res: Response) => {
  logger.info('Fetching all movies');

  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 10));
  const sortBy = (req.query.sortBy as string) || 'createdAt';
  const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;

  // Build filter query
  const filter: any = {};
  
  if (req.query.genre) {
    filter.genre = req.query.genre;
  }
  
  if (req.query.language) {
    filter.languages = { $in: [req.query.language] };
  }

  if (req.query.releaseYear) {
    const year = Number(req.query.releaseYear);
    if (!isNaN(year)) {
      const startDate = new Date(year, 0, 1);
      const endDate = new Date(year + 1, 0, 1);
      filter.releaseDate = { $gte: startDate, $lt: endDate };
    }
  }

  const totalMovies = await Movie.countDocuments(filter);
  const totalPages = Math.ceil(totalMovies / limit);

  if (page > totalPages && totalPages > 0) {
    throw new ApiError(`Page ${page} does not exist. Total pages: ${totalPages}`, 400);
  }

  const movies = await Movie.find(filter)
    .sort({ [sortBy]: sortOrder })
    .skip((page - 1) * limit)
    .limit(limit)
    .select('-__v');

  logger.info(`Fetched ${movies.length} movies (page ${page}/${totalPages})`);

  res.status(200).json({
    success: true,
    message: 'Movies fetched successfully',
    statusCode: 200,
    data: {
      movies,
      pagination: {
        currentPage: page,
        totalPages,
        totalMovies,
        moviesPerPage: limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    }
  });
});

export const GetMovieById = AsyncHandler(async (req: Request, res: Response) => {
  logger.info(`Fetching movie by ID: ${req.params.id}`);

  const { id } = req.params;

  if (!id || id.length !== 24) {
    throw new ApiError('Invalid movie ID format', 400);
  }

  const movie = await Movie.findById(id)
    .populate('comments')
    .select('-__v');

  if (!movie) {
    throw new ApiError('Movie not found', 404);
  }

  logger.info(`Movie found: ${movie.title}`);

  res.status(200).json({
    success: true,
    message: 'Movie fetched successfully',
    statusCode: 200,
    data: { movie }
  });
});

export const UpdateMovie = AsyncHandler(async (req: Request, res: Response) => {
  logger.info(`Updating movie: ${req.params.id}`);

  const { id } = req.params;

  if (!id || id.length !== 24) {
    throw new ApiError('Invalid movie ID format', 400);
  }

  const allowedUpdates = [
    'title', 'description', 'cast', 'duration', 'releaseDate',
    'languages', 'genre', 'poster', 'video_url', 'showTime',
    'ticketPrice', 'totalTickets'
  ];

  const updates = Object.keys(req.body);
  const isValidOperation = updates.every(update => allowedUpdates.includes(update));

  if (!isValidOperation) {
    throw new ApiError('Invalid updates. Only certain fields can be updated', 400);
  }

  const movie = await Movie.findByIdAndUpdate(
    id,
    { ...req.body, updatedAt: new Date() },
    { new: true, runValidators: true }
  );

  if (!movie) {
    throw new ApiError('Movie not found', 404);
  }

  logger.info(`Movie updated successfully: ${movie.title}`);

  res.status(200).json({
    success: true,
    message: 'Movie updated successfully',
    statusCode: 200,
    data: { movie }
  });
});

export const DeleteMovie = AsyncHandler(async (req: Request, res: Response) => {
  logger.info(`Deleting movie: ${req.params.id}`);

  const { id } = req.params;

  if (!id || id.length !== 24) {
    throw new ApiError('Invalid movie ID format', 400);
  }

  const movie = await Movie.findByIdAndDelete(id);

  if (!movie) {
    throw new ApiError('Movie not found', 404);
  }

  logger.info(`Movie deleted successfully: ${movie.title} (ID: ${id})`);

  res.status(200).json({
    success: true,
    message: 'Movie deleted successfully',
    statusCode: 200,
    data: {
      deletedMovie: {
        id: movie._id,
        title: movie.title
      }
    }
  });
});

export const GetUpcomingMovies = AsyncHandler(async (req: Request, res: Response) => {
  logger.info('Fetching upcoming movies');

  const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 10));
  const now = new Date();

  const upcomingMovies = await Movie.find({
    releaseDate: { $gt: now }
  })
    .sort({ releaseDate: 1 })
    .limit(limit)
    .select('-__v');

  logger.info(`Found ${upcomingMovies.length} upcoming movies`);

  res.status(200).json({
    success: true,
    message: 'Upcoming movies fetched successfully',
    statusCode: 200,
    data: {
      movies: upcomingMovies,
      count: upcomingMovies.length
    }
  });
});

export const GetNowShowingMovies = AsyncHandler(async (req: Request, res: Response) => {
  logger.info('Fetching now showing movies');

  const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 10));
  const now = new Date();

  const nowShowingMovies = await Movie.find({
    releaseDate: { $lte: now },
    ticketsRemaining: { $gt: 0 }
  })
    .sort({ releaseDate: -1 })
    .limit(limit)
    .select('-__v');

  logger.info(`Found ${nowShowingMovies.length} now showing movies`);

  res.status(200).json({
    success: true,
    message: 'Now showing movies fetched successfully',
    statusCode: 200,
    data: {
      movies: nowShowingMovies,
      count: nowShowingMovies.length
    }
  });
});
