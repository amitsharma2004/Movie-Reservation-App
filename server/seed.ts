import dotenv from 'dotenv';
import { dbConnect } from './src/config/database.js';
import { seedMovies } from './src/utils/seedMovies.js';
import logger from './src/utils/logger.js';

async function runSeed() {
  const force = process.argv.includes('--force');
  try {
    logger.info('Connecting to database...');
    await dbConnect();
    
    logger.info('Running seed script...');
    await seedMovies(force);
    
    logger.info('Seed completed successfully!');
    process.exit(0);
  } catch (error) {
    logger.error('Seed failed:', error);
    process.exit(1);
  }
}

runSeed();
