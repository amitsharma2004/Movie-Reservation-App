import cron from 'node-cron';
import logger from './logger.js';
import { deleteUnacceptedTheaters } from '../modules/threaters/threater.service.js';

/**
 * Schedule cron job to delete unaccepted theaters
 * Runs every day at 11:59 PM
 */
export const scheduleTheaterCleanup = () => {
    // Cron expression: '59 23 * * *' = At 11:59 PM every day
    cron.schedule('59 23 * * *', async () => {
        try {
            logger.info('Running scheduled theater cleanup job...');
            const deletedCount = await deleteUnacceptedTheaters();
            logger.info(`Theater cleanup completed. Deleted ${deletedCount} unaccepted theaters.`);
        } catch (error: any) {
            logger.error(`Theater cleanup job failed: ${error.message}`);
        }
    }, {
        timezone: 'Asia/Kolkata' // Adjust timezone as needed
    });

    logger.info('Theater cleanup cron job scheduled (runs daily at 11:59 PM)');
};

/**
 * Initialize all cron jobs
 */
export const initializeCronJobs = () => {
    scheduleTheaterCleanup();
    logger.info('All cron jobs initialized');
};
