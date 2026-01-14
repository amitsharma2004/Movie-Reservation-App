import Joi from "joi";

const movieSchema = Joi.object({
  title: Joi.string()
    .min(1)
    .max(200)
    .trim()
    .required()
    .messages({
      'string.empty': 'Movie title is required',
      'string.min': 'Movie title must be at least 1 character',
      'string.max': 'Movie title cannot exceed 200 characters'
    }),

  description: Joi.string()
    .min(10)
    .max(1000)
    .trim()
    .required()
    .messages({
      'string.empty': 'Movie description is required',
      'string.min': 'Description must be at least 10 characters',
      'string.max': 'Description cannot exceed 1000 characters'
    }),

  cast: Joi.array()
    .items(Joi.string().trim())
    .min(1)
    .required()
    .messages({
      'array.min': 'At least one cast member is required',
      'array.base': 'Cast must be an array of strings'
    }),

  duration: Joi.number()
    .min(1)
    .max(600)
    .required()
    .messages({
      'number.min': 'Duration must be at least 1 minute',
      'number.max': 'Duration cannot exceed 600 minutes',
      'number.base': 'Duration must be a number'
    }),

  releaseDate: Joi.date()
    .required()
    .messages({
      'date.base': 'Release date must be a valid date'
    }),

  languages: Joi.array()
    .items(Joi.string().trim())
    .min(1)
    .required()
    .messages({
      'array.min': 'At least one language is required',
      'array.base': 'Languages must be an array of strings'
    }),

  genre: Joi.string()
    .valid("Action", "Comedy", "Horror", "Romance", "Sci-Fi", "Drama", "Thriller", "Adventure", "Fantasy", "Animation")
    .required()
    .messages({
      'any.only': 'Genre must be one of: Action, Comedy, Horror, Romance, Sci-Fi, Drama, Thriller, Adventure, Fantasy, Animation',
      'string.empty': 'Genre is required'
    }),

  poster: Joi.string()
    .optional()
    .allow('')
    .messages({
      'string.uri': 'Poster must be a valid URL'
    }),

  video_url: Joi.string()
    .uri()
    .optional()
    .allow('')
    .messages({
      'string.uri': 'Video URL must be a valid URL'
    }),

  totalTickets: Joi.object({
    Silver: Joi.number().min(0).max(1000).required(),
    Gold: Joi.number().min(0).max(1000).required(),
    Platinum: Joi.number().min(0).max(1000).required()
  })
    .required()
    .messages({
      'object.base': 'Total tickets must be an object with Silver, Gold, and Platinum properties',
      'number.min': 'Ticket count cannot be negative',
      'number.max': 'Ticket count cannot exceed 1000 per category'
    }),

  ticketPrice: Joi.object({
    Silver: Joi.number().min(1).max(10000).required(),
    Gold: Joi.number().min(1).max(10000).required(),
    Platinum: Joi.number().min(1).max(10000).required()
  })
    .required()
    .messages({
      'object.base': 'Ticket price must be an object with Silver, Gold, and Platinum properties',
      'number.min': 'Ticket price must be at least 1',
      'number.max': 'Ticket price cannot exceed 10000'
    }),

  showTime: Joi.date()
    .optional()
    .messages({
      'date.base': 'Show time must be a valid date'
    })
});

export default movieSchema;
