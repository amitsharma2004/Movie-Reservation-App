import {
    createTheater,
    updateTheater,
    getTheater,
    getAllTheaters,
    deleteTheater,
    searchTheaters
} from './threater.controller.js'
import express from 'express'
import { verifyToken, verifyAdmin } from '../../middlewares/user.middleware.js'

const ThreaterRouter = express.Router()

ThreaterRouter.post('/create', verifyAdmin, createTheater);
ThreaterRouter.put('/update/:id', verifyAdmin, updateTheater);
ThreaterRouter.get('/get/:id', getTheater);
ThreaterRouter.get('/getall', getAllTheaters);
ThreaterRouter.delete('/delete/:id', verifyAdmin, deleteTheater);
ThreaterRouter.get('/search', searchTheaters);


export default ThreaterRouter;