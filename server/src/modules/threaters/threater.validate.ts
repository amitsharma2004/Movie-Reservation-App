import joi from 'joi';

const threaterValidationSchema = joi.object({
    name: joi.string()
        .required()
        .trim()
        .min(1)
        .max(100)
        .messages({
            'string.empty': 'Theater name is required',
            'any.required': 'Theater name is required'
        }),
    
    location: joi.string()
        .required()
        .trim()
        .min(1)
        .max(200)
        .messages({
            'string.empty': 'Location is required',
            'any.required': 'Location is required'
        }),
    
    address: joi.string()
        .required()
        .trim()
        .min(1)
        .max(300)
        .messages({
            'string.empty': 'Address is required',
            'any.required': 'Address is required'
        }),
    
    city: joi.string()
        .required()
        .trim()
        .min(1)
        .max(100)
        .messages({
            'string.empty': 'City is required',
            'any.required': 'City is required'
        }),
    
    state: joi.string()
        .required()
        .trim()
        .min(1)
        .max(100)
        .messages({
            'string.empty': 'State is required',
            'any.required': 'State is required'
        }),
    
    zipCode: joi.string()
        .required()
        .trim()
        .pattern(/^[0-9]{5,10}$/)
        .messages({
            'string.empty': 'Zip code is required',
            'any.required': 'Zip code is required',
            'string.pattern.base': 'Zip code must be 5-10 digits'
        }),
    
    country: joi.string()
        .trim()
        .min(1)
        .max(100)
        .default('India'),
    
    capacity: joi.number()
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
    
    screens: joi.number()
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
    
    amenities: joi.array()
        .items(joi.string().trim().min(1).max(50))
        .default([]),
    
    isActive: joi.boolean()
        .default(true),
    
    threaterLogo: joi.string()
        .required()
        .uri()
        .messages({
            'string.empty': 'Theater logo is required',
            'any.required': 'Theater logo is required',
            'string.uri': 'Theater logo must be a valid URL'
        }),
    
    contactNumber: joi.string()
        .trim()
        .pattern(/^[+]?[0-9\s\-\(\)]{10,15}$/)
        .messages({
            'string.pattern.base': 'Contact number must be a valid phone number'
        }),
    
    email: joi.string()
        .trim()
        .email()
        .lowercase()
        .messages({
            'string.email': 'Email must be a valid email address'
        }),
    
    description: joi.string()
        .trim()
        .max(1000)
        .messages({
            'string.max': 'Description cannot exceed 1000 characters'
        }),
    
    parkingAvailable: joi.boolean()
        .default(false),
    
    foodCourtAvailable: joi.boolean()
        .default(false),
    
    rating: joi.number()
        .min(0)
        .max(5)
        .default(0)
        .messages({
            'number.min': 'Rating must be at least 0',
            'number.max': 'Rating cannot exceed 5'
        })
});

export default threaterValidationSchema;
