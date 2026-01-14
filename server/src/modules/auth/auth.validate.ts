import Joi from "joi";

const registerSchema = Joi.object({
    fullname: Joi.string()
        .min(2)
        .max(100)
        .trim()
        .required()
        .messages({
            'string.empty': 'Full name is required',
            'string.min': 'Full name must be at least 2 characters',
            'string.max': 'Full name cannot exceed 100 characters'
        }),
    
    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'org', 'io', 'me', 'in', 'co'] }})
        .lowercase()
        .trim()
        .required()
        .messages({
            'string.empty': 'Email is required',
            'string.email': 'Please provide a valid email address'
        }),
    
    password: Joi.string()
        .min(8)
        .max(255)
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
        .required()
        .messages({
            'string.empty': 'Password is required',
            'string.min': 'Password must be at least 8 characters',
            'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)'
        }),
    
    address: Joi.string()
        .min(5)
        .max(255)
        .trim()
        .required()
        .messages({
            'string.empty': 'Address is required',
            'string.min': 'Address must be at least 5 characters'
        }),
    
    city: Joi.string()
        .min(2)
        .max(100)
        .trim()
        .required()
        .messages({
            'string.empty': 'City is required'
        }),
    
    state: Joi.string()
        .min(2)
        .max(100)
        .trim()
        .required()
        .messages({
            'string.empty': 'State is required'
        }),
    
    phone: Joi.string()
        .pattern(/^[0-9]{10,15}$/)
        .required()
        .messages({
            'string.empty': 'Phone number is required',
            'string.pattern.base': 'Phone number must be between 10-15 digits'
        }),
    
    zipCode: Joi.string()
        .pattern(/^[0-9]{5,10}$/)
        .required()
        .messages({
            'string.empty': 'Zip code is required',
            'string.pattern.base': 'Zip code must be between 5-10 digits'
        }),
    
    country: Joi.string()
        .min(2)
        .max(100)
        .trim()
        .required()
        .messages({
            'string.empty': 'Country is required'
        }),
    
    role: Joi.string()
        .valid('user', 'admin')
        .default('user')
        .optional(),
    
    subscription: Joi.string().optional(),
    avatar: Joi.string().optional(),
    isVerfied: Joi.boolean().default(false).optional(),
    history: Joi.array().default([]).optional(),
    cretedAt: Joi.date().default(Date.now).optional(),
    updatedAt: Joi.date().default(Date.now).optional()
});

const loginSchema = Joi.object({
    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'org', 'io', 'me', 'in', 'co'] }})
        .lowercase()
        .trim()
        .required()
        .messages({
            'string.empty': 'Email is required',
            'string.email': 'Please provide a valid email address'
        }),
    
    password: Joi.string()
        .min(8)
        .max(255)
        .required()
        .messages({
            'string.empty': 'Password is required',
            'string.min': 'Password must be at least 8 characters'
        })
});

export { 
    registerSchema,
    loginSchema
};