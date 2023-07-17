import { authenticateToken } from "@/middlewares";
import { Router } from "express";
import * as hotelsControllers from "@/controllers/hotel-controllers"

const hotelRouter = Router();

hotelRouter
    .all('/*', authenticateToken)
    .get('/hotels', hotelsControllers.getHotels)
    .get('/hotels/:hotelId', hotelsControllers.getHotelsRooms);

export { hotelRouter };