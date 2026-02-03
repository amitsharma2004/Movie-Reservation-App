import { describe, it, expect, beforeEach } from '@jest/globals';
import request from 'supertest';
import express from 'express';
import { faker } from '@faker-js/faker';
import { Movie } from '../src/modules/movies/movie.model.js';
import { searchMovie, FetchNearByShows } from '../src/modules/movies/movie.controller.js';
import globalErrorHandler from '../src/middlewares/globalErrorHandler.js';

// Create test app
const app = express();
app.use(express.json());
app.get('/api/movies/search', searchMovie);
app.get('/api/movies/nearby', FetchNearByShows);
app.use(globalErrorHandler);

describe('Movie Controller Tests', () => {
  describe('GET /api/movies/search - Search Movies', () => {
    beforeEach(async () => {
      await Movie.create([
        {
          title: 'The Dark Knight',
          description: 'Batman fights crime in Gotham',
          cast: ['Christian Bale', 'Heath Ledger'],
          duration: 152,
          releaseDate: new Date('2008-07-18'),
          languages: ['English'],
          genre: 'Action',
          poster: 'https://example.com/poster1.jpg',
          totalTickets: { Silver: 100, Gold: 50, Platinum: 30 },
          ticketPrice: { Silver: 150, Gold: 250, Platinum: 400 },
          totalTicketsSold: 0,
          totalRates: 0,
          comments: [],
        },
        {
          title: 'Inception',
          description: 'A thief who steals corporate secrets',
          cast: ['Leonardo DiCaprio', 'Tom Hardy'],
          duration: 148,
          releaseDate: new Date('2010-07-16'),
          languages: ['English'],
          genre: 'Sci-Fi',
          poster: 'https://example.com/poster2.jpg',
          totalTickets: { Silver: 100, Gold: 50, Platinum: 30 },
          ticketPrice: { Silver: 150, Gold: 250, Platinum: 400 },
          totalTicketsSold: 0,
          totalRates: 0,
          comments: [],
        },
        {
          title: 'The Hangover',
          description: 'Three friends wake up from a bachelor party',
          cast: ['Bradley Cooper', 'Zach Galifianakis'],
          duration: 100,
          releaseDate: new Date('2009-06-05'),
          languages: ['English'],
          genre: 'Comedy',
          poster: 'https://example.com/poster3.jpg',
          totalTickets: { Silver: 100, Gold: 50, Platinum: 30 },
          ticketPrice: { Silver: 150, Gold: 250, Platinum: 400 },
          totalTicketsSold: 0,
          totalRates: 0,
          comments: [],
        },
      ]);
    });

    it('should search movies by title', async () => {
      const response = await request(app)
        .get('/api/movies/search')
        .query({ title: 'Dark Knight' })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.movies.length).toBeGreaterThan(0);
      expect(response.body.data.movies[0].title).toContain('Dark Knight');
    });

    it('should search movies by genre', async () => {
      const response = await request(app)
        .get('/api/movies/search')
        .query({ genre: 'Comedy' })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.movies.length).toBeGreaterThan(0);
      expect(response.body.data.movies[0].genre).toBe('Comedy');
    });

    it('should search movies by cast', async () => {
      const response = await request(app)
        .get('/api/movies/search')
        .query({ cast: 'Leonardo DiCaprio' })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.movies.length).toBeGreaterThan(0);
    });

    it('should fail without search parameters', async () => {
      const response = await request(app)
        .get('/api/movies/search')
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('search parameter is required');
    });

    it('should return empty array for non-matching search', async () => {
      const response = await request(app)
        .get('/api/movies/search')
        .query({ title: 'NonExistentMovie12345' })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.movies.length).toBe(0);
    });
  });

  describe('GET /api/movies/nearby - Fetch Nearby Shows', () => {
    it('should fail without coordinates', async () => {
      const response = await request(app)
        .get('/api/movies/nearby')
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Latitude and longitude are required');
    });

    it('should fail with invalid coordinates', async () => {
      const response = await request(app)
        .get('/api/movies/nearby')
        .query({ latitude: 'invalid', longitude: 'invalid' })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Invalid coordinates');
    });

    it('should return not implemented error', async () => {
      const response = await request(app)
        .get('/api/movies/nearby')
        .query({ latitude: '28.6139', longitude: '77.2090' })
        .expect(501);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('not yet implemented');
    });
  });

  describe('Movie Model Tests', () => {
    it('should create a movie with valid data', async () => {
      const movieData = {
        title: faker.lorem.words(3),
        description: faker.lorem.paragraph(),
        cast: [faker.person.fullName(), faker.person.fullName()],
        duration: 120,
        releaseDate: faker.date.future(),
        languages: ['English', 'Hindi'],
        genre: 'Action',
        poster: 'https://example.com/poster.jpg',
        totalTickets: { Silver: 100, Gold: 50, Platinum: 30 },
        ticketPrice: { Silver: 150, Gold: 250, Platinum: 400 },
        totalTicketsSold: 0,
        totalRates: 0,
        comments: [],
      };

      const movie = new Movie(movieData);
      await movie.save();

      expect(movie._id).toBeDefined();
      expect(movie.title).toBe(movieData.title);
      expect(movie.ticketsRemaining).toBe(180);
    });

    it('should calculate tickets remaining on save', async () => {
      const movie = new Movie({
        title: 'Test Movie',
        description: 'Test description for the movie',
        cast: ['Actor 1'],
        duration: 120,
        releaseDate: new Date(),
        languages: ['English'],
        genre: 'Drama',
        poster: 'https://example.com/poster.jpg',
        totalTickets: { Silver: 50, Gold: 30, Platinum: 20 },
        ticketPrice: { Silver: 100, Gold: 200, Platinum: 300 },
        totalTicketsSold: 0,
        totalRates: 0,
        comments: [],
      });

      await movie.save();
      expect(movie.ticketsRemaining).toBe(100);
    });

    it('should fail with invalid genre', async () => {
      const movie = new Movie({
        title: 'Test Movie',
        description: 'Test description',
        cast: ['Actor 1'],
        duration: 120,
        releaseDate: new Date(),
        languages: ['English'],
        genre: 'InvalidGenre' as any,
        poster: 'https://example.com/poster.jpg',
        totalTickets: { Silver: 100, Gold: 50, Platinum: 30 },
        ticketPrice: { Silver: 150, Gold: 250, Platinum: 400 },
        totalTicketsSold: 0,
        totalRates: 0,
        comments: [],
      });

      await expect(movie.save()).rejects.toThrow();
    });

    it('should fail without required fields', async () => {
      const movie = new Movie({
        title: 'Test Movie',
      } as any);

      await expect(movie.save()).rejects.toThrow();
    });

    it('should have timestamps', async () => {
      const movie = new Movie({
        title: 'Test Movie',
        description: 'Test description',
        cast: ['Actor 1'],
        duration: 120,
        releaseDate: new Date(),
        languages: ['English'],
        genre: 'Drama',
        poster: 'https://example.com/poster.jpg',
        totalTickets: { Silver: 100, Gold: 50, Platinum: 30 },
        ticketPrice: { Silver: 150, Gold: 250, Platinum: 400 },
        totalTicketsSold: 0,
        totalRates: 0,
        comments: [],
      });

      await movie.save();
      
      const savedMovie = await Movie.findById(movie._id);
      expect(savedMovie).toBeDefined();
      expect((savedMovie as any).createdAt).toBeDefined();
      expect((savedMovie as any).updatedAt).toBeDefined();
    });
  });
});
