import Joi from "joi";

const movieSchema = Joi.object({
  title: Joi.string().min(3).max(100).required(),
  description: Joi.string().min(10).max(400).required(),

  cast: Joi.array().items(Joi.string()).required(),

  duration: Joi.number().min(1).required(),

  releaseDate: Joi.date().required(),

  languages: Joi.array().items(Joi.string()).required(),

  genre: Joi.string()
    .valid("Action", "Comedy", "Horror", "Romance", "Sci-Fi", "Drama")
    .required(),

  poster: Joi.string().uri().required(),
  video_url: Joi.string().uri().required(),

  totalTickets: Joi.object({
    Silver: Joi.number().min(0).required(),
    Gold: Joi.number().min(0).required(),
    Platinum: Joi.number().min(0).required()
  }).required(),

  ticketPrice: Joi.object({
    Silver: Joi.number().min(1).required(),
    Gold: Joi.number().min(1).required(),
    Platinum: Joi.number().min(1).required()
  }).required()
});

export default movieSchema;
