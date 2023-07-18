import { authenticateToken } from "@/middlewares";
import { Router } from "express";
import * as hotelsControllers from "@/controllers/hotel-controllers"

const hotelRouter = Router();

hotelRouter
    .all('/*', authenticateToken)
    .get('/', hotelsControllers.getHotels)
    .get('/:hotelId', hotelsControllers.getHotelsRooms);

export { hotelRouter };