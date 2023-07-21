import { forbiddenError } from "@/errors";
import * as bookingRepository from "@/repositories/booking-repository";
import enrollmentRepository from "@/repositories/enrollment-repository";
import ticketsRepository from "@/repositories/tickets-repository";
import { TicketStatus } from "@prisma/client";

export async function getBooking(userId: number){
   const booking = await bookingRepository.getBooking(userId);
   return booking;
};

export async function createBooking(roomId: number, userId: number){
    await checkTicket(userId);
    //TODO: Verificar disponibilidade do quarto
    await bookingRepository.createBooking();
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