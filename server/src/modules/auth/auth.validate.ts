import Joi from "joi";

export const validate = (schema: Joi.Schema) => {
    return (req: any, res: any, next: any) => {
        const { error, value } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }
        req.body = value;
        next();
    };
};