import { forbiddenError, notFoundError } from "@/errors";
import * as bookingRepository from "@/repositories/booking-repository";
import enrollmentRepository from "@/repositories/enrollment-repository";
import ticketsRepository from "@/repositories/tickets-repository";
import { TicketStatus } from "@prisma/client";

export async function getBooking(userId: number){
   const booking = await bookingRepository.getBooking(userId);
   return booking;
};

interface bookingId {
    bookingId: number;
}
export async function createBooking(roomId: number, userId: number){
    await checkTicket(userId);
    const room = await bookingRepository.getRoomsInfo(roomId);
    if(!room) throw notFoundError();
    const reservations = await bookingRepository.getReservations(roomId);
    if(room.capacity <= reservations) throw forbiddenError();
    const booking = await bookingRepository.createBooking(roomId, userId);
   const response = {bookingId: booking.id}
    return response;
};

export async function updateBooking(){
    await bookingRepository.updateBooking();
};

async function checkTicket(userId: number){
    const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
    const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);

    if(ticket.status === TicketStatus.RESERVED
        || ticket.TicketType.isRemote === true
        || ticket.TicketType.includesHotel === false)
    throw forbiddenError();
};