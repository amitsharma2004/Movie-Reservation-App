import Joi from 'joi';

// Validation schema for creating a payment
export const createPaymentSchema = Joi.object({
    amount: Joi.number()
        .positive()
        .required()
        .messages({
            'number.base': 'Amount must be a number',
            'number.positive': 'Amount must be positive',
            'any.required': 'Amount is required'
        }),
    movieId: Joi.string()
        .pattern(/^[0-9a-fA-F]{24}$/)
        .required()
        .messages({
            'string.pattern.base': 'Invalid movie ID format',
            'any.required': 'Movie ID is required'
        }),
    ticketId: Joi.string()
        .pattern(/^[0-9a-fA-F]{24}$/)
        .required()
        .messages({
            'string.pattern.base': 'Invalid ticket ID format',
            'any.required': 'Ticket ID is required'
        }),
    paymentMethod: Joi.string()
        .valid('card', 'upi', 'netbanking', 'wallet')
        .required()
        .messages({
            'any.only': 'Payment method must be one of: card, upi, netbanking, wallet',
            'any.required': 'Payment method is required'
        }),
    currency: Joi.string()
        .uppercase()
        .length(3)
        .default('INR')
        .messages({
            'string.length': 'Currency must be a 3-letter code'
        }),
});

export const updatePaymentStatusSchema = Joi.object({
    status: Joi.string()
        .valid('Pending', 'Confirmed', 'Failed', 'Refunded')
        .required()
        .messages({
            'any.only': 'Status must be one of: Pending, Confirmed, Failed, Refunded',
            'any.required': 'Status is required'
        }),
    transactionId: Joi.string()
        .trim()
        .when('status', {
            is: 'Confirmed',
            then: Joi.required(),
            otherwise: Joi.optional()
        })
        .messages({
            'any.required': 'Transaction ID is required for confirmed payments'
        }),
    failureReason: Joi.string()
        .trim()
        .when('status', {
            is: 'Failed',
            then: Joi.required(),
            otherwise: Joi.optional()
        })
        .messages({
            'any.required': 'Failure reason is required for failed payments'
        }),
});

// Validation schema for refund
export const refundPaymentSchema = Joi.object({
    refundAmount: Joi.number()
        .positive()
        .required()
        .messages({
            'number.base': 'Refund amount must be a number',
            'number.positive': 'Refund amount must be positive',
            'any.required': 'Refund amount is required'
        }),
    refundReason: Joi.string()
        .trim()
        .min(10)
        .max(500)
        .required()
        .messages({
            'string.min': 'Refund reason must be at least 10 characters',
            'string.max': 'Refund reason must not exceed 500 characters',
            'any.required': 'Refund reason is required'
        }),
});

// Validation schema for payment query parameters
export const paymentQuerySchema = Joi.object({
    status: Joi.string()
        .valid('Pending', 'Confirmed', 'Failed', 'Refunded')
        .optional(),
    paymentMethod: Joi.string()
        .valid('card', 'upi', 'netbanking', 'wallet')
        .optional(),
    startDate: Joi.date()
        .iso()
        .optional(),
    endDate: Joi.date()
        .iso()
        .min(Joi.ref('startDate'))
        .optional()
        .messages({
            'date.min': 'End date must be after start date'
        }),
    page: Joi.number()
        .integer()
        .min(1)
        .default(1),
    limit: Joi.number()
        .integer()
        .min(1)
        .max(100)
        .default(10),
});

export default {
    createPaymentSchema,
    updatePaymentStatusSchema,
    refundPaymentSchema,
    paymentQuerySchema
};
