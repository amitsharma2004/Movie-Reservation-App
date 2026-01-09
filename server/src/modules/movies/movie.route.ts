import { verifyAdmin } from "../../middlewares/user.middleware.js";
import { AddMovieToDatabase, searchMovie } from "./movie.controller.js";
import { GetAllMovies, DeleteMovie } from "./movie.service.js";
import express from 'express';


const MovieRouter = express();

MovieRouter.route('/').post(verifyAdmin, AddMovieToDatabase);
MovieRouter.route('/').get(verifyAdmin, GetAllMovies);
MovieRouter.route('/').get(searchMovie);
MovieRouter.route('/:movieId').delete(verifyAdmin, DeleteMovie);

export default MovieRouter;
