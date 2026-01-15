import mongoose from "mongoose";
import { Ticket } from "../modules/tickets/ticket.model.js";

export interface IMovie extends mongoose.Document {
    totalSeats: { Silver: number; Gold: number; Platinum: number };
    ticketPrice: { Silver: number; Gold: number; Platinum: number };
}

const GenSeatsForMovie = async (movie: IMovie) => {
    const seats = [];

    const categories = [
        { name: "Silver", count: movie.totalSeats.Silver, price: movie.ticketPrice.Silver },
        { name: "Gold", count: movie.totalSeats.Gold, price: movie.ticketPrice.Gold },
        { name: "Platinum", count: movie.totalSeats.Platinum, price: movie.ticketPrice.Platinum }
    ];

    let seatCounter = 1;

    for (const category of categories) {
        for (let i = 0; i < category.count; i++) {
            seats.push({
                movie: movie._id,
                seatNumber: `${category.name}-${seatCounter}`,
                isseatBooked: false,
                price: category.price,
                category: category.name 
            });
            seatCounter++;
        }
    }

    if (seats.length > 0) {
        await Ticket.insertMany(seats);
    }
    
    return seats.length;
};

export default GenSeatsForMovie;