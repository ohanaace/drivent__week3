import { Response } from "express";
import * as hotelsService from "@/services/hotels-service";
import httpStatus from "http-status";
import { AuthenticatedRequest } from "@/middlewares";


export async function getHotels(req: AuthenticatedRequest, res: Response) {
    const {userId} = req
    try {
        const hotels = await hotelsService.getHotels(userId);
        res.send(hotels);
    } catch (error) {
        if (error.name === 'NotFoundError') {
            return res.sendStatus(httpStatus.NOT_FOUND);
        };
        if (error.name === 'PaymentRequiredError') {
            return res.sendStatus(httpStatus.PAYMENT_REQUIRED);
        };
        res.sendStatus(httpStatus.BAD_REQUEST);
    };
};

export async function getHotelsRooms(req: AuthenticatedRequest, res: Response) {
    try {
        const hotelId = Number(req.params.hotelId);
        const { userId } = req
        const hotel = await hotelsService.getHotelsRooms(hotelId, userId);
        res.send(hotel);
    } catch (error) {
        if (error.name === 'NotFoundError') {
            return res.sendStatus(httpStatus.NOT_FOUND);
        }
        if (error.name === 'PaymentRequiredError') {
            return res.sendStatus(httpStatus.PAYMENT_REQUIRED);
        };
        res.sendStatus(httpStatus.BAD_REQUEST);
    };
};