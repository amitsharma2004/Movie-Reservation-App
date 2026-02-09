import Joi from 'joi';

const threaterValidationSchema = Joi.object({
    name: Joi.string()
        .required()
        .trim()
        .min(1)
        .max(100)
        .messages({
            'string.empty': 'Theater name is required',
            'any.required': 'Theater name is required'
        }),
    
    location: Joi.string()
        .required()
        .trim()
        .min(1)
        .max(200)
        .messages({
            'string.empty': 'Location is required',
            'any.required': 'Location is required'
        }),
    
    address: Joi.string()
        .required()
        .trim()
        .min(1)
        .max(300)
        .messages({
            'string.empty': 'Address is required',
            'any.required': 'Address is required'
        }),
    
    city: Joi.string()
        .required()
        .trim()
        .min(1)
        .max(100)
        .messages({
            'string.empty': 'City is required',
            'any.required': 'City is required'
        }),
    
    state: Joi.string()
        .required()
        .trim()
        .min(1)
        .max(100)
        .messages({
            'string.empty': 'State is required',
            'any.required': 'State is required'
        }),
    
    zipCode: Joi.string()
        .required()
        .trim()
        .pattern(/^[0-9]{5,10}$/)
        .messages({
            'string.empty': 'Zip code is required',
            'any.required': 'Zip code is required',
            'string.pattern.base': 'Zip code must be 5-10 digits'
        }),
    
    country: Joi.string()
        .trim()
        .min(1)
        .max(100)
        .default('India'),
    
    capacity: Joi.number()
        .required()
        .integer()
        .min(1)
        .max(10000)
        .messages({
            'number.base': 'Capacity must be a number',
            'any.required': 'Capacity is required',
            'number.min': 'Capacity must be at least 1',
            'number.max': 'Capacity cannot exceed 10000'
        }),
    
    screens: Joi.number()
        .required()
        .integer()
        .min(1)
        .max(50)
        .messages({
            'number.base': 'Number of screens must be a number',
            'any.required': 'Number of screens is required',
            'number.min': 'Must have at least 1 screen',
            'number.max': 'Cannot exceed 50 screens'
        }),
    
    amenities: Joi.array()
        .items(Joi.string().trim().min(1).max(50))
        .default([]),
    
    isActive: Joi.boolean()
        .default(true),
    
    threaterLogo: Joi.string()
        .required()
        .uri()
        .messages({
            'string.empty': 'Theater logo is required',
            'any.required': 'Theater logo is required',
            'string.uri': 'Theater logo must be a valid URL'
        }),
    
    contactNumber: Joi.string()
        .trim()
        .pattern(/^[+]?[0-9\s\-\(\)]{10,15}$/)
        .messages({
            'string.pattern.base': 'Contact number must be a valid phone number'
        }),
    
    email: Joi.string()
        .trim()
        .email()
        .lowercase()
        .messages({
            'string.email': 'Email must be a valid email address'
        }),
    
    description: Joi.string()
        .trim()
        .max(1000)
        .messages({
            'string.max': 'Description cannot exceed 1000 characters'
        }),
    
    parkingAvailable: Joi.boolean()
        .default(false),
    
    foodCourtAvailable: Joi.boolean()
        .default(false),
    
    rating: Joi.number()
        .min(0)
        .max(5)
        .default(0)
        .messages({
            'number.min': 'Rating must be at least 0',
            'number.max': 'Rating cannot exceed 5'
        })
});

export default threaterValidationSchema;
