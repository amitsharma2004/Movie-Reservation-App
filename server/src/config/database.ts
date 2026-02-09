import mongoose from "mongoose";
import logger from "../utils/logger.js";
import { ApiError } from "../middlewares/globalErrorHandler.js";

const MONGO_URI = process.env.MONGOOSE_URI || "";
if (!MONGO_URI) throw new ApiError ('MONGO_URI not found', 400);

const dbConnect = async () => {
  const connection = await mongoose.connect (MONGO_URI);
  if (!connection) throw new ApiError ('mongodb is not connected', 400);

  console.log (`mongoDB is conneted: ${connection.connection.host}`);
}

export { dbConnect };