import express from 'express';
import { login, register, logout, getUser, updateUser } from './auth.controller.js';
import { verifyToken } from '../../middlewares/user.middleware.js';
import { upload } from '../../config/multer.js';

const userRouter = express.Router();

userRouter.post('/register', upload.single('avatar'), register);

// POST /auth/login - User login
userRouter.post('/login', login);

// POST /auth/logout - User logout (requires authentication)
userRouter.post('/logout', verifyToken, logout);

// GET /auth/profile - Get user profile
userRouter.get('/profile', verifyToken, getUser);

// PUT /auth/profile - Update user profile
userRouter.put('/profile', verifyToken, updateUser);

export default userRouter;