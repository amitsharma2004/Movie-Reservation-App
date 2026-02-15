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

    // Add ownerId and set approval status to pending
    const theaterData = {
        ...value,
        ownerId: authRequest.userId,
        approvalStatus: 'pending'
    };

    const theater = await theaterService.createTheater(theaterData);

    logger.info(`Theater created successfully: ${theater.name} (Pending approval)`);
    res.status(201).json({
        success: true,
        message: 'Theater submitted for approval. Admin will review your request.',
        statusCode: 201,
        data: { theater }
    });
});

// Update theater
const updateTheater = AsyncHandler(async (req: any, res: Response) => {
    const authRequest = req as AuthRequest;
    logger.info('Updating theater...');

    const { id } = authRequest.params;

    if (!id) {
        throw new ApiError('Theater ID is required', 400);
    }

    const { error, value } = threaterValidationSchema.validate(authRequest.body, { abortEarly: false });
    if (error) {
        const errorMessages = error.details.map(detail => detail.message).join(', ');
        throw new ApiError(errorMessages, 400);
    }

    const theater = await theaterService.updateTheater(id, value);

    logger.info(`Theater ${id} updated successfully`);
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

    const { id } = authRequest.params;

    if (!id) {
        throw new ApiError('Theater ID is required', 400);
    }

    const theater = await theaterService.getTheaterById(id);

    logger.info(`Theater ${id} fetched successfully`);
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

    const { id } = authRequest.params;

    if (!id) {
        throw new ApiError('Theater ID is required', 400);
    }

    await theaterService.deleteTheater(id);

    logger.info(`Theater ${id} deleted successfully`);
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

// Get pending theaters (Admin only)
const getPendingTheaters = AsyncHandler(async (req: any, res: Response) => {
    logger.info('Fetching pending theaters...');

    const theaters = await theaterService.getPendingTheaters();

    logger.info(`Found ${theaters.length} pending theaters`);
    res.status(200).json({
        success: true,
        message: 'Pending theaters fetched successfully',
        statusCode: 200,
        data: { theaters, count: theaters.length }
    });
});

// Approve theater (Admin only)
const approveTheater = AsyncHandler(async (req: any, res: Response) => {
    const authRequest = req as AuthRequest;
    logger.info('Approving theater...');

    const { id } = authRequest.params;

    if (!id) {
        throw new ApiError('Theater ID is required', 400);
    }

    const theater = await theaterService.approveTheater(id, authRequest.userId);

    logger.info(`Theater ${id} approved successfully`);
    res.status(200).json({
        success: true,
        message: 'Theater approved successfully',
        statusCode: 200,
        data: { theater }
    });
});

// Reject theater (Admin only)
const rejectTheater = AsyncHandler(async (req: any, res: Response) => {
    const authRequest = req as AuthRequest;
    logger.info('Rejecting theater...');

    const { id } = authRequest.params;
    const { reason } = authRequest.body;

    if (!id) {
        throw new ApiError('Theater ID is required', 400);
    }

    const theater = await theaterService.rejectTheater(id, reason);

    logger.info(`Theater ${id} rejected`);
    res.status(200).json({
        success: true,
        message: 'Theater rejected',
        statusCode: 200,
        data: { theater }
    });
});

export {
    createTheater,
    updateTheater,
    getTheater,
    getAllTheaters,
    deleteTheater,
    searchTheaters,
    getPendingTheaters,
    approveTheater,
    rejectTheater
};