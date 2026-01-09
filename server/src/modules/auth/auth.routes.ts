import express from 'express';
import { login, register, logout } from './auth.controller.js';
import { verifyAdmin, verifyToken } from '../../middlewares/user.middleware.js';

const userRouter = express.Router();

userRouter.route('/').post(register);
userRouter.route('/').put(login);
userRouter.route('/').patch(verifyToken, logout);

export default userRouter;