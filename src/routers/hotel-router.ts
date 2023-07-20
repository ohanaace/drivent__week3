import { authenticateToken } from "@/middlewares";
import { Router } from "express";
import { getHotels, getHotelsRooms } from "@/controllers/hotel-controllers";

const hotelRouter = Router();

hotelRouter
    .all('/*', authenticateToken)
    .get('/', getHotels)
    .get('/:hotelId', getHotelsRooms);

export { hotelRouter };