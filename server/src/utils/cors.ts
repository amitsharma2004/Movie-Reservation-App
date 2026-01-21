import cors from 'cors';

const corsOptions = cors({
    origin: '*',
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type,Authorization',
    exposedHeaders: 'Content-Type,Authorization',
    preflightContinue: false,   
    maxAge: 86400,
    optionsSuccessStatus: 200
})

export default corsOptions