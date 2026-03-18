import { Movie } from '../modules/movies/movie.model.js';
import logger from './logger.js';

const sampleMovies = [
  {
    title: 'The Dark Knight',
    description: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
    cast: ['Christian Bale', 'Heath Ledger', 'Aaron Eckhart', 'Michael Caine'],
    duration: 152,
    releaseDate: new Date('2008-07-18'),
    languages: ['English', 'Hindi'],
    genre: 'Action',
    poster: 'https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=400',
    totalTickets: { Silver: 100, Gold: 50, Platinum: 30 },
    ticketPrice: { Silver: 200, Gold: 350, Platinum: 500 },
    ticketsRemaining: { Silver: 45, Gold: 12, Platinum: 8 },
    totalTicketsSold: 115,
    totalRates: 9.0,
    showTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  },
  {
    title: 'Inception',
    description: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
    cast: ['Leonardo DiCaprio', 'Joseph Gordon-Levitt', 'Ellen Page', 'Tom Hardy'],
    duration: 148,
    releaseDate: new Date('2010-07-16'),
    languages: ['English', 'Hindi', 'Tamil'],
    genre: 'Thriller',
    poster: 'https://images.unsplash.com/photo-1616530940355-351fabd9524b?w=400',
    totalTickets: { Silver: 120, Gold: 60, Platinum: 40 },
    ticketPrice: { Silver: 250, Gold: 400, Platinum: 600 },
    ticketsRemaining: { Silver: 80, Gold: 30, Platinum: 5 },
    totalTicketsSold: 105,
    totalRates: 8.8,
    showTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
  },
  {
    title: 'The Shawshank Redemption',
    description: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.',
    cast: ['Tim Robbins', 'Morgan Freeman', 'Bob Gunton'],
    duration: 142,
    releaseDate: new Date('1994-09-23'),
    languages: ['English', 'Hindi'],
    genre: 'Drama',
    poster: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400',
    totalTickets: { Silver: 100, Gold: 50, Platinum: 25 },
    ticketPrice: { Silver: 180, Gold: 300, Platinum: 450 },
    ticketsRemaining: { Silver: 60, Gold: 20, Platinum: 10 },
    totalTicketsSold: 85,
    totalRates: 9.3,
    showTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
  },
  {
    title: 'The Hangover',
    description: 'Three buddies wake up from a bachelor party in Las Vegas, with no memory of the previous night and the bachelor missing.',
    cast: ['Bradley Cooper', 'Ed Helms', 'Zach Galifianakis'],
    duration: 100,
    releaseDate: new Date('2009-06-05'),
    languages: ['English', 'Hindi'],
    genre: 'Comedy',
    poster: 'https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=400',
    totalTickets: { Silver: 80, Gold: 40, Platinum: 20 },
    ticketPrice: { Silver: 150, Gold: 250, Platinum: 400 },
    ticketsRemaining: { Silver: 35, Gold: 18, Platinum: 7 },
    totalTicketsSold: 80,
    totalRates: 7.7,
    showTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
  },
  {
    title: 'Avengers: Endgame',
    description: "After the devastating events of Infinity War, the Avengers assemble once more to reverse Thanos' actions and restore balance to the universe.",
    cast: ['Robert Downey Jr.', 'Chris Evans', 'Mark Ruffalo', 'Scarlett Johansson'],
    duration: 181,
    releaseDate: new Date('2019-04-26'),
    languages: ['English', 'Hindi', 'Tamil', 'Telugu'],
    genre: 'Action',
    poster: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?w=400',
    totalTickets: { Silver: 150, Gold: 80, Platinum: 50 },
    ticketPrice: { Silver: 300, Gold: 500, Platinum: 750 },
    ticketsRemaining: { Silver: 90, Gold: 25, Platinum: 3 },
    totalTicketsSold: 162,
    totalRates: 8.4,
    showTime: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
  },
  {
    title: 'Forrest Gump',
    description: 'The presidencies of Kennedy and Johnson, the Vietnam War, and other historical events unfold from the perspective of an Alabama man.',
    cast: ['Tom Hanks', 'Robin Wright', 'Gary Sinise'],
    duration: 142,
    releaseDate: new Date('1994-07-06'),
    languages: ['English', 'Hindi'],
    genre: 'Drama',
    poster: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400',
    totalTickets: { Silver: 90, Gold: 45, Platinum: 25 },
    ticketPrice: { Silver: 180, Gold: 300, Platinum: 450 },
    ticketsRemaining: { Silver: 55, Gold: 22, Platinum: 11 },
    totalTicketsSold: 72,
    totalRates: 8.8,
    showTime: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
  },
  {
    title: 'Superbad',
    description: 'Two co-dependent high school seniors are forced to deal with separation anxiety after their plan to stage a booze-soaked party goes awry.',
    cast: ['Jonah Hill', 'Michael Cera', 'Christopher Mintz-Plasse'],
    duration: 113,
    releaseDate: new Date('2007-08-17'),
    languages: ['English'],
    genre: 'Comedy',
    poster: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400',
    totalTickets: { Silver: 70, Gold: 35, Platinum: 15 },
    ticketPrice: { Silver: 150, Gold: 250, Platinum: 400 },
    ticketsRemaining: { Silver: 20, Gold: 8, Platinum: 2 },
    totalTicketsSold: 90,
    totalRates: 7.6,
    showTime: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
  },
  {
    title: 'Se7en',
    description: 'Two detectives hunt a serial killer who uses the seven deadly sins as his motives.',
    cast: ['Morgan Freeman', 'Brad Pitt', 'Kevin Spacey'],
    duration: 127,
    releaseDate: new Date('1995-09-22'),
    languages: ['English', 'Hindi'],
    genre: 'Thriller',
    poster: 'https://images.unsplash.com/photo-1594908900066-3f47337549d8?w=400',
    totalTickets: { Silver: 100, Gold: 50, Platinum: 30 },
    ticketPrice: { Silver: 200, Gold: 350, Platinum: 500 },
    ticketsRemaining: { Silver: 70, Gold: 35, Platinum: 15 },
    totalTicketsSold: 60,
    totalRates: 8.6,
    showTime: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000),
  },
];

export async function seedMovies(force = false) {
  try {
    logger.info('Starting movie seeding...');
    
    // Check if movies already exist
    const existingMovies = await Movie.countDocuments();
    if (existingMovies > 0 && !force) {
      logger.info(`Database already has ${existingMovies} movies. Skipping seed. Use --force to re-seed.`);
      return;
    }

    if (force && existingMovies > 0) {
      await Movie.deleteMany({});
      logger.info(`Deleted ${existingMovies} existing movies for re-seed.`);
    }

    // Insert sample movies
    const result = await Movie.insertMany(sampleMovies);
    logger.info(`Successfully seeded ${result.length} movies to the database`);
    
    return result;
  } catch (error: any) {
    logger.error('Error seeding movies:', error);
    throw error;
  }
}

export default seedMovies;