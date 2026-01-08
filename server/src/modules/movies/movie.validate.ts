import Joi from "joi";

const movieSchema = Joi.object({
    title: Joi.string().min(3).max(100).required(),
    description: Joi.string().min(10).max(400).required(),
    cast: Joi.array().required(),
    duration: Joi.date().required(),
    ticketsRemaining: Joi.number().required(),
    realease_date: Joi.date().required(),
    languages: Joi.array().required(),
    genre: Joi.string().required(),
    poster: Joi.string().required(),
    video_url: Joi.string().required(),
    createdAt: Joi.date().required(),
    updatedAt: Joi.date().required(),
    totalTickets: Joi.number().required()
});

export default movieSchema;