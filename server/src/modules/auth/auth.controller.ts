import logger from "../../utils/logger.js";
import { ApiError } from "../../middlewares/globalErrorHandler.js";
import { User } from "./auth.model.js";
import { AsyncHandler } from "../../middlewares/globalErrorHandler.js";
import { registerSchema, loginSchema } from "./auth.validate.js";
import cloudinary from "../../config/cloudinary.js";

const register = AsyncHandler (async (req: any, res: any) => {
    logger.info ('Registering new user...');

    try {
        const { error, value } = registerSchema.validate(req.body);
        if (error) throw new ApiError(error.details[0].message, 400);

        const isUserExist = await User.findOne({ email: value.email });
        if (isUserExist) throw new ApiError('user already exist', 400);

        const user = new User({
            ...value
        });
        await user.save();
        const userData = user.toJSON();
        res.status(201).json({
            message: 'user created successfully',
            statusCode: 201,
            user: userData,
            success: true
        });
        
    } catch (error: any) {
        logger.error('failed to create new user');
        res.status(error.status).json({
            message: error.message || 'Internal Server Error',
            statusCode: error.status || 500,
            success: false,
            user: null
        })
    }
});

const login = AsyncHandler (async (req: any, res: any) => {
    logger.info ("Logging in user...")

    try {
        const { error, value } = loginSchema.validate(req.body);
        if (error) throw new ApiError(error.details[0].message, 400);

        const user = await User.findOne({ email: value.email });
        if (!user) throw new ApiError('user not found', 404);

        const isPasswordMatched = user.comparePassword(value.password);
        if (!isPasswordMatched) throw new ApiError('invalid password', 400);

        const { accessToken, refreshToken } = await user.generateToken();
        if ([accessToken, refreshToken].map((field: string) => field?.trim()).includes('')) throw new ApiError('failed to generate token', 500);

        const options = {
            httpOnly: true,
            secure: true,
            sameSite: 'strict'
        }
        res.cookie('accessToken', accessToken, options);
        res.cookie('refreshToken', refreshToken, options);

        const userData = user.toJSON();
        res.status(200).json({
            message: 'user logged in successfully',
            tokens: { AccessToken: accessToken ,
                RefreshToken: refreshToken
            },
            statusCode: 200,
            user: userData,
            success: true
        })
    } catch (error: any) {
        logger.error('failed to login user');
        res.status(error.status).json({
            message: error.message || 'Internal Server Error',
            statusCode: error.status || 500,
            success: false,
            user: null
        })
    }
});

const logout = AsyncHandler (async (req: any, res: any) => {
    logger.info ("Logging out user...")

    try {
        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');
        res.status(200).json({
            message: 'user logged out successfully',
            statusCode: 200,
            success: true
        })
    } catch (error: any) {
        logger.error('failed to logout user');
        res.status(error.status).json({
            message: error.message || 'Internal Server Error',
            statusCode: error.status || 500,
            success: false,
            user: null
        })
    }
});

export { 
    register,
    login,
    logout
}