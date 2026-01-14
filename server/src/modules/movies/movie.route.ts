import express from 'express';
import { verifyAdmin, verifyToken } from "../../middlewares/user.middleware.js";
import { AddMovieToDatabase, searchMovie, FetchNearByShows } from "./movie.controller.js";
import { 
  GetAllMovies, 
  GetMovieById, 
  UpdateMovie, 
  DeleteMovie,
  GetUpcomingMovies,
  GetNowShowingMovies
} from "./movie.service.js";
import { upload } from "../../config/multer.js";

const MovieRouter = express.Router();

// Public routes
MovieRouter.get('/search', searchMovie);
MovieRouter.get('/upcoming', GetUpcomingMovies);
MovieRouter.get('/now-showing', GetNowShowingMovies);
MovieRouter.get('/nearby', FetchNearByShows);
MovieRouter.get('/:id', GetMovieById);
MovieRouter.get('/', GetAllMovies);

// Admin routes
MovieRouter.post('/', verifyAdmin, upload.single('poster'), AddMovieToDatabase);
MovieRouter.put('/:id', verifyAdmin, UpdateMovie);
MovieRouter.delete('/:id', verifyAdmin, DeleteMovie);

export default MovieRouter;
