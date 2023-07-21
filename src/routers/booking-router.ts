import { Router } from "express";
import { authenticateToken, validateBody } from "@/middlewares";
import { createBooking, getBooking, updateBooking } from "@/controllers";
import { bookingSchema } from "@/schemas";
const bookingRouter = Router();

bookingRouter
    .all('/*', authenticateToken)
    .get('/', validateBody(bookingSchema), getBooking)
    .post('/', createBooking)
    .put('/:bookingId', updateBooking);

export { bookingRouter };