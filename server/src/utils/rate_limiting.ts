import { rateLimit } from 'express-rate-limit'

const limiter = rateLimit ({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: 'draft-8',
    message: 'Too many requests from this IP, please try again after 15 minutes',
    legacyHeaders: false,
    ipv6Subnet: 56
})

export default limiter;