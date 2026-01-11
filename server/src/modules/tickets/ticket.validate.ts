import Joi from "joi";

const objectId = Joi.string().hex().length(24);

const ticketSchema = Joi.object({
  title: Joi.string().min(3).max(40).required(),

  price: Joi.number().positive().required(),

  userId: objectId.required(),

  orderId: Joi.string().required(),

  ticketExpiryDate: Joi.date().required(),

  status: Joi.string()
    .valid("active", "expired", "cancelled", "used")
    .required(),

  movie: objectId.required(),

  paymentId: objectId.required(),

  paymentStatus: Joi.string()
    .valid("Pending", "Success", "Failed")
    .required(),

  theater: Joi.string().min(2).max(100).required(),

  seatNumber: Joi.number().integer().min(1).required(),

  seatCategory: Joi.string()
    .valid("Silver", "Gold", "Platinum")
    .required(),

  showTime: Joi.date().required(),

  address: Joi.string().min(5).max(200).required(),

  isSeatBooked: Joi.boolean().required(),

  isTicketActive: Joi.boolean().required()
});

export default ticketSchema;
