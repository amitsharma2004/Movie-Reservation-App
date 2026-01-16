import { ApiError, AsyncHandler } from "../../middlewares/globalErrorHandler.js";
import logger from "../../utils/logger.js";
import { AuthRequest } from "../../middlewares/user.middleware.js";
import { Response } from "express";
import threaterValidationSchema from "./threater.validate.js";
import * as theaterService from "./threater.service.js";

// Create a new theater
const createTheater = AsyncHandler(async (req: any, res: Response) => {
    const authRequest = req as AuthRequest;
    logger.info('Creating new theater...');

    const { error, value } = threaterValidationSchema.validate(authRequest.body, { abortEarly: false });
    if (error) {
        const errorMessages = error.details.map(detail => detail.message).join(', ');
        throw new ApiError(errorMessages, 400);
    }

    const theater = await theaterService.createTheater(value);

    logger.info(`Theater created successfully: ${theater.name}`);
    res.status(201).json({
        success: true,
        message: 'Theater created successfully',
        statusCode: 201,
        data: { theater }
    });
});

// Update theater
const updateTheater = AsyncHandler(async (req: any, res: Response) => {
    const authRequest = req as AuthRequest;
    logger.info('Updating theater...');

    const { theaterId } = authRequest.params;

    if (!theaterId) {
        throw new ApiError('Theater ID is required', 400);
    }

    const { error, value } = threaterValidationSchema.validate(authRequest.body, { abortEarly: false });
    if (error) {
        const errorMessages = error.details.map(detail => detail.message).join(', ');
        throw new ApiError(errorMessages, 400);
    }

    const theater = await theaterService.updateTheater(theaterId, value);

    logger.info(`Theater ${theaterId} updated successfully`);
    res.status(200).json({
        success: true,
        message: 'Theater updated successfully',
        statusCode: 200,
        data: { theater }
    });
});

// Get theater by ID
const getTheater = AsyncHandler(async (req: any, res: Response) => {
    const authRequest = req as AuthRequest;
    logger.info('Fetching theater details...');

    const { theaterId } = authRequest.params;

    if (!theaterId) {
        throw new ApiError('Theater ID is required', 400);
    }

    const theater = await theaterService.getTheaterById(theaterId);

    logger.info(`Theater ${theaterId} fetched successfully`);
    res.status(200).json({
        success: true,
        message: 'Theater fetched successfully',
        statusCode: 200,
        data: { theater }
    });
});

// Get all theaters
const getAllTheaters = AsyncHandler(async (req: any, res: Response) => {
    const authRequest = req as AuthRequest;
    logger.info('Fetching all theaters...');

    const { city, isActive } = authRequest.query;

    const filters: any = {};
    if (city) filters.city = city;
    if (isActive !== undefined) filters.isActive = isActive === 'true';

    const theaters = await theaterService.getAllTheaters(filters);

    logger.info(`Fetched ${theaters.length} theaters`);
    res.status(200).json({
        success: true,
        message: 'Theaters fetched successfully',
        statusCode: 200,
        data: { theaters, count: theaters.length }
    });
});

// Delete theater
const deleteTheater = AsyncHandler(async (req: any, res: Response) => {
    const authRequest = req as AuthRequest;
    logger.info('Deleting theater...');

    const { theaterId } = authRequest.params;

    if (!theaterId) {
        throw new ApiError('Theater ID is required', 400);
    }

    await theaterService.deleteTheater(theaterId);

    logger.info(`Theater ${theaterId} deleted successfully`);
    res.status(200).json({
        success: true,
        message: 'Theater deleted successfully',
        statusCode: 200
    });
});

// Search theaters
const searchTheaters = AsyncHandler(async (req: any, res: Response) => {
    const authRequest = req as AuthRequest;
    logger.info('Searching theaters...');

    const { q } = authRequest.query;

    if (!q) {
        throw new ApiError('Search query is required', 400);
    }

    const theaters = await theaterService.searchTheaters(q as string);

    logger.info(`Found ${theaters.length} theaters matching search`);
    res.status(200).json({
        success: true,
        message: 'Search completed successfully',
        statusCode: 200,
        data: { theaters, count: theaters.length }
    });
});

export {
    createTheater,
    updateTheater,
    getTheater,
    getAllTheaters,
    deleteTheater,
    searchTheaters
};