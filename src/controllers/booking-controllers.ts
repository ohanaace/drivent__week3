import { Response } from "express";
import httpStatus from "http-status";
import { AuthenticatedRequest } from "@/middlewares";
import * as bookingService from "@/services/booking-service"
import { CreateBookingBody } from "@/protocols";

export async function getBooking(req: AuthenticatedRequest, res: Response) {
    try {
        const { userId } = req;
        const booking = await bookingService.getBooking(userId);
        res.send(booking);
    } catch (error) {
        res.sendStatus(httpStatus.NOT_FOUND);
    };
};

export async function createBooking(req: AuthenticatedRequest, res: Response) {
    try {
        const { roomId } = req.body as CreateBookingBody;
        const { userId } = req;
        const booking = await bookingService.createBooking(roomId, userId);
        res.status(httpStatus.OK).send(booking);
    } catch (error) {
        if (error.name === 'ForbiddenError') return res.status(httpStatus.FORBIDDEN).send(error.message);
    };
};

export async function updateBooking(req: AuthenticatedRequest, res: Response) {
    try {

    } catch (error) {

    };
};