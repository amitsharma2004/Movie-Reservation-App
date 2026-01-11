import { Ticket } from "../modules/tickets/ticket.model.js";

const GenSeatsForMovie = async (movie: any, category: string, price: string) => {
    const seats = [];

    const categories = {
        Silver: movie.totalSeats.Silver,
        Gold: movie.totalSeats.Gold,
        Platinum: movie.totalSeats.Platinum
    }

    for (let i = 1; i < movie.totalSeats; i++) {
        seats.push({
            movie:  movie._id,
            seatNumber: i + 1,
            isseatBooked: false,
            price: movie.price
        })
    }

    await Ticket.insertMany (seats);
}

export default GenSeatsForMovie;