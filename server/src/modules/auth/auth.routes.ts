import express from 'express';
import { login, register, logout } from './auth.controller.js';
import { verifyToken } from '../../middlewares/user.middleware.js';
import { upload } from '../../config/multer.js';

const userRouter = express.Router();

// POST /auth/register - Register new user
userRouter.post('/register', upload.single('avatar'), register);

// POST /auth/login - User login
userRouter.post('/login', login);

// POST /auth/logout - User logout (requires authentication)
userRouter.post('/logout', verifyToken, logout);

export default userRouter;