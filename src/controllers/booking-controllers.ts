import { Response } from "express";
import httpStatus from "http-status";
import { AuthenticatedRequest } from "@/middlewares";
import * as bookingService from "@/services/booking-service"

export async function getBooking(req: AuthenticatedRequest, res: Response){
    try {
        //const booking = await bookingService.getBooking();
        //res.send(booking)
    } catch (error) {
        res.sendStatus(httpStatus.NOT_FOUND);
    };
};

export async function createBooking(req: AuthenticatedRequest, res: Response){
    try {
        
    } catch (error) {
        
    };
};

export async function updateBooking(req: AuthenticatedRequest, res: Response){
    try {
        
    } catch (error) {
        
    };
};