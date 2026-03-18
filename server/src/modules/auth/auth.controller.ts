import { Request, Response } from 'express';
import logger from "../../utils/logger.js";
import { ApiError, AsyncHandler } from "../../middlewares/globalErrorHandler.js";
import { User } from "./auth.model.js";
import { registerSchema, loginSchema } from "./auth.validate.js";
import { AuthRequest } from "../../middlewares/user.middleware.js";

const register = AsyncHandler(async (req: Request, res: Response) => {
    logger.info('Registering new user...');

    const { error, value } = registerSchema.validate(req.body, { abortEarly: false });
    if (error) {
        const errorMessages = error.details.map(detail => detail.message).join(', ');
        throw new ApiError(errorMessages, 400);
    }

    const existingUser = await User.findOne({ email: value.email });
    if (existingUser) {
        throw new ApiError('User with this email already exists', 409);
    }

    // Handle avatar upload
    const avatarPath = req.file 
        ? `/uploads/${req.file.filename}` 
        : 'default-avatar-url';

    const user = new User({
        fullname: value.fullname,
        email: value.email,
        password: value.password,
        address: value.address || '',
        city: value.city || '',
        state: value.state || '',
        phone: value.phone || '',
        zipCode: value.zipCode || '',
        country: value.country || '',
        role: value.role || 'user',
        avatar: avatarPath
    });

    await user.save();
    const userData = user.toJSON();
    
    // Generate tokens for auto-login after registration
    const { accessToken, refreshToken } = user.generateToken();
    
    const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax' as const,
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    };

    res.cookie('accessToken', accessToken, { ...cookieOptions, maxAge: 60 * 60 * 1000 }); // 1 hour
    res.cookie('refreshToken', refreshToken, cookieOptions);

    logger.info(`User registered successfully: ${userData.email}`);
    res.status(201).json({
        success: true,
        message: 'User registered successfully',
        statusCode: 201,
        data: { 
            user: userData,
            tokens: {
                accessToken,
                refreshToken
            }
        }
    });
});

const login = AsyncHandler(async (req: Request, res: Response) => {
    logger.info("User login attempt...");

    const { error, value } = loginSchema.validate(req.body, { abortEarly: false });
    if (error) {
        const errorMessages = error.details.map(detail => detail.message).join(', ');
        throw new ApiError(errorMessages, 400);
    }

    const user = await User.findOne({ email: value.email });
    if (!user) {
        throw new ApiError('Invalid email or password', 401);
    }

    const isPasswordMatched = user.comparePassword(value.password);
    if (!isPasswordMatched) {
        throw new ApiError('Invalid email or password', 401);
    }

    const { accessToken, refreshToken } = user.generateToken();
    
    if (!accessToken || !refreshToken) {
        logger.error('Token generation failed');
        throw new ApiError('Failed to generate authentication tokens', 500);
    }

    const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax' as const,
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    };

    res.cookie('accessToken', accessToken, { ...cookieOptions, maxAge: 60 * 60 * 1000 }); // 1 hour
    res.cookie('refreshToken', refreshToken, cookieOptions);

    const userData = user.toJSON();
    logger.info(`User logged in successfully: ${userData.email}`);

    res.status(200).json({
        success: true,
        message: 'Login successful',
        statusCode: 200,
        data: {
            user: userData,
            tokens: {
                accessToken,
                refreshToken
            }
        }
    });
});

const logout = AsyncHandler(async (req: Request, res: Response) => {
    logger.info("User logout...");

    const authReq = req as AuthRequest;
    const userId = authReq.userId || 'unknown';

    const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax' as const
    };

    res.clearCookie('accessToken', cookieOptions);
    res.clearCookie('refreshToken', cookieOptions);

    logger.info(`User logged out: ${userId}`);
    res.status(200).json({
        success: true,
        message: 'Logout successful',
        statusCode: 200
    });
});

const getUser = AsyncHandler(async (req: Request, res: Response) => {
    const authReq = req as AuthRequest;
    const userId = authReq.userId;

    if (!userId) {
        throw new ApiError('User not authenticated', 401);
    }

    const user = await User.findById(userId);
    if (!user) {
        throw new ApiError('User not found', 404);
    }

    const userData = user.toJSON();
    logger.info(`User profile retrieved: ${userData.email}`);

    res.status(200).json({
        success: true,
        message: 'User profile retrieved successfully',
        statusCode: 200,
        data: { user: userData }
    });
});

const updateUser = AsyncHandler(async (req: Request, res: Response) => {
    try {
        logger.info("Updating user profile...");
    
        const authReq = req as AuthRequest;
        const userId = authReq.userId;
    
        if (!userId) {
            throw new ApiError('User not authenticated', 401);
        }
    
        const user = await User.findById(userId);
        if (!user) {
            throw new ApiError('User not found', 404);
        }
    
        // Handle avatar upload if provided
        const avatarPath = req.file 
            ? `/uploads/${req.file.filename}` 
            : user.avatar;
    
        const updateData = {
            fullname: req.body.fullname || user.fullname,
            address: req.body.address || user.address,
            city: req.body.city || user.city,
            state: req.body.state || user.state,
            phone: req.body.phone || user.phone,
            zipCode: req.body.zipCode || user.zipCode,
            country: req.body.country || user.country,
            avatar: avatarPath
    };
        const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true });
        if (!updatedUser) {
            throw new ApiError('Failed to update user profile', 500);
        }
    
        const userData = updatedUser.toJSON();
        logger.info(`User profile updated successfully: ${userData.email}`);
    
        res.status(200).json({
            success: true,
            message: 'User profile updated successfully',
            statusCode: 200,
            data: { user: userData }
        });
    } catch (error: any) {
        logger.error (`${error.message}`);
        res.status (error.status || 500).json ({
            messsag: error.message,
            status: error.status || 500
        })
    }
});


export { 
    register,
    login,
    logout,
    getUser,
    updateUser,
};