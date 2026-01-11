import express from "express";
import { verifyToken } from "../../middlewares/user.middleware.js";
// import { createTicket } from "../tickets/ticket.controller.js";

const ticketRouter = express.Router();

ticketRouter.route('/:movieId/new').post(verifyToken, )