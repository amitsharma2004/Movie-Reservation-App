import {
    createTheater,
    updateTheater,
    getTheater,
    getAllTheaters,
    deleteTheater,
    searchTheaters,
    getPendingTheaters,
    approveTheater,
    rejectTheater
} from './threater.controller.js'
import express from 'express'
import { verifyToken, verifyAdmin } from '../../middlewares/user.middleware.js'

const ThreaterRouter = express.Router()

// User routes (authenticated)
ThreaterRouter.post('/create', verifyToken, createTheater);

// Public routes
ThreaterRouter.get('/get/:id', getTheater);
ThreaterRouter.get('/getall', getAllTheaters);
ThreaterRouter.get('/search', searchTheaters);

// Admin routes
ThreaterRouter.get('/pending', verifyAdmin, getPendingTheaters);
ThreaterRouter.put('/approve/:id', verifyAdmin, approveTheater);
ThreaterRouter.put('/reject/:id', verifyAdmin, rejectTheater);
ThreaterRouter.put('/update/:id', verifyAdmin, updateTheater);
ThreaterRouter.delete('/delete/:id', verifyAdmin, deleteTheater);


export default ThreaterRouter;