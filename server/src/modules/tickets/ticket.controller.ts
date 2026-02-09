import { Ticket } from "./ticket.model.js";
import logger from "../../utils/logger.js";
import { ApiError } from "../../middlewares/globalErrorHandler.js";
import { AsyncHandler } from "../../middlewares/globalErrorHandler.js";
import ticketSchema from "./ticket.validate.js";
import { Movie } from "../movies/movie.model.js";
import { RedisClient } from "../../config/redis.js";
import { searchMovie } from "../movies/movie.controller.js";
import { Payment } from "../Payments/payment.model.js";

const seatKey = (seat: number, movie: string) => `seat:${seat}:${movie}`;

const LockSeat = async (seatNumber: number, movieId: string, userId: string) => {
    const key: string = `seat:${seatNumber}:${movieId}`;
    const lock = await RedisClient.setEx(key, 10, userId)
    if (!lock) throw new ApiError ('Seats temporarily unavailable', 409);
}

const UnlockSeat = async (seatNumber: number, movieId: string) => {
    const key = `seat:${seatNumber}:${movieId}`;
    await RedisClient.del(key);
}

const isSeatLocked = async (seatNumber: number, movieId: string, userId: string) => {
    const lockUser = await RedisClient.get(seatKey(seatNumber, movieId));
    return lockUser && lockUser !== userId.toString();
}

const CreateTicket = AsyncHandler (async (req: any, res: any) => {
    logger.info ('ticket is adding to database');

    try {
        const { error, value } = ticketSchema.validate(req.body);
        if (error) throw new ApiError(`${error.details[0].message}`, 400);
        if (value.isSeatBooked) throw new ApiError('Seat is already booked', 400);
    
        const userId = req.user._id;
        const seatNumber = value.seatNumber;
        const movieId = req.params.movieId;
        if (await isSeatLocked (seatNumber, movieId, userId)) throw new ApiError ('Seat is already booked', 409);

        const movie = await Movie.findById (movieId);
        if (!movie) throw new ApiError ('Movie not found', 404);

        await LockSeat (seatNumber, movieId, userId);
        const ticket = new Ticket ({
            userId: userId,
            movie: movieId, 
            seatNumber: seatNumber,
            price: movie?.ticketPrice,
            paymentStatus: 'Pending',
            isSeatBooked: false
        });

        await ticket.save();
        return res.status (200).json ({
            message: 'Ticket created successfully',
            success: true,
            ticket
        });
        await UnlockSeat (seatNumber, movieId);
    } catch (error: any) {
        logger.error ('Error in creating ticket', error);
        res.status (error.statusCode).json ({
            message: error.message,
            success: false,
            stack: error.stack
        })
    }
});

const ConfirmTicket = AsyncHandler (async (req: any, res: any) => {
    logger.info ('ticket is confirming');

    try {
        const userId = req.user._id;
        const paymentId = req.params.paymentId;
        const ticketId = req.params.ticketId;
        const ticket = await Ticket.findById (ticketId);
        if (!ticket) throw new ApiError ('Ticket not found', 404);
        if (ticket.userId !== userId) throw new ApiError ('Unauthorized Access', 403);

        if (!ticket.isSeatBooked) {
            const payment = await Payment.findById (paymentId);
            if (!payment || payment?.status !== 'Confirmed')throw new ApiError ('Payment not confirmed', 400);
                ticket.isSeatBooked = true;
                ticket.paymentStatus = 'Success';
                await ticket.save();
                res.status (200).json ({
                    message: 'Ticket confirmed successfully',
                    success: true,
                    ticket
                })
        } else throw new ApiError ('Ticket is already confirmed', 400);
    } catch (error: any) {
        logger.error ('Error in confirming ticket', error);
        res.status (error.statusCode).json ({
            message: error.message,
            success: false,
            stack: error.stack
        })
    }
});

const GetUnbookedTickets = AsyncHandler (async (req: any, res: any) => {
    logger.info ('getting unbooked tickets');

    try {
        const movieId = req.params.movieId;
        
        const tickets = await Ticket.find ({ movie: movieId, isSeatBooked: true });
        if (tickets) {
            
        }
    } catch (error) {
        
    }
})

export { CreateTicket, 
    ConfirmTicket,
    GetUnbookedTickets
 }