import { forbiddenError, notFoundError } from "@/errors";
import * as bookingRepository from "@/repositories/booking-repository";
import enrollmentRepository from "@/repositories/enrollment-repository";
import ticketsRepository from "@/repositories/tickets-repository";
import { TicketStatus } from "@prisma/client";

export async function getBooking(userId: number){
   const booking = await bookingRepository.getBooking(userId);
   if(!booking) throw notFoundError();
   return booking;
};

export async function createBooking(roomId: number, userId: number){
    await checkTicket(userId);
    const room = await bookingRepository.getRoomsInfo(roomId);
    if(!room) throw notFoundError();
    const reservations = await bookingRepository.getReservations(roomId);
    if(room.capacity <= reservations) throw forbiddenError();
    const response = await bookingRepository.createBooking(roomId, userId);
    const booking = {bookingId: response.id};
    return booking;
};

export async function updateBooking(roomId: number, userId: number, bookingId: number){
    const reservation = await bookingRepository.getBooking(userId);
    if(!reservation) throw forbiddenError();
    const room = await bookingRepository.getRoomsInfo(roomId);
    if(!room) throw notFoundError();
    const capacity = await bookingRepository.getReservations(roomId);
    if(room.capacity <= capacity) throw forbiddenError()
    const response = await bookingRepository.updateBooking(roomId, bookingId);
    const booking = {bookingId: response.id};
    return booking;
};

async function checkTicket(userId: number){
    const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
    const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);

    if(ticket.status === TicketStatus.RESERVED
        || ticket.TicketType.isRemote === true
        || ticket.TicketType.includesHotel === false)
    throw forbiddenError();
};