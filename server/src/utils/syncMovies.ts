import { Movie } from "../modules/movies/movie.model.js";
import esClient from "../config/elastic_search.js";
import logger from "./logger.js";

const syncMovies = async () => {
    try {
        const exists = await esClient.indices.exists({ index: "movies" });

        if (!exists) {
            const movies = await Movie.find().lean();
        
        for (const movie of movies) {
            esClient.index({
                index: 'movies',
                id: movie._id.toString(),
                document: {
                    title: movie.title,
                    genre: movie.genre,
                    year: movie.realease_date.getFullYear(),
                    languages: movie.languages,
                    cast: movie.cast
                }
            })
        }
        }
    } catch (error: any) {
        logger.error('Failed to sync movies to Elasticsearch', error.details[0].message);
    }

    await esClient.indices.refresh({ index: 'movies' });
    logger.info('Movies synced to Elasticsearch');
}

export default syncMovies;