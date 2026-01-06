import Joi from "joi";

interface RegisterSchema {
    fullname: string,
    email: string,
    password: string,
    role: string,
    subscription: string,
    cretedAt: Date,
    updatedAt: Date,
    address: string,
    city: string,
    state: string,
    phone: string,
    zipCode: string,
    country: string,
    avatar: string,
    isVerfied: boolean,
    history: string[]
}

const registerSchema =  Joi.object({
    fullname: Joi.string().required(),
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'org', 'io', 'me'] }}).required(),
    password: Joi.string().min(6).max(255).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/).required(),
    role: Joi.string().required(),
    subscription: Joi.string().required(),
    cretedAt: Joi.date().required(),
    updatedAt: Joi.date().required(),
    address: Joi.string().required(),
    city: Joi.string().required(),
    state: Joi.string().required(),
    phone: Joi.string().required(),
    zipCode: Joi.string().required(),
    country: Joi.string().required(),
    avatar: Joi.string().required(),
    isVerfied: Joi.boolean().required(),
    history: Joi.array().required()
});

const loginSchema = Joi.object({
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'org', 'io', 'me'] }}).max(255).required(),
    password: Joi.string().min(6).max(255).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/).required(),
});

export { 
    registerSchema,
    loginSchema
};