import mongoose from "mongoose";
import { ApiError } from "../middlewares/globalErrorHandler.js";
import logger from "../utils/logger.js";
import dotenv from 'dotenv';

dotenv.config();
const MONGOOSE_URI = process.env.MONGOOSE_URI;

if (!MONGOOSE_URI) {
    throw new Error("Please provide MONGOOSE_URI in the environment variables");
}

const dbConnect = async () => {
    try {
        const connection = await mongoose.connect(MONGOOSE_URI);
        if (!connection) throw new ApiError('connection is not establized', 501);
        logger.info(`connected to mongoDB: ${connection.connection.host}`);

    } catch (error: any) {
        logger.error('Error: ', error.message);
    }
}

export { 
    dbConnect  
};