import * as hotelRepositories from "@/repositories/hotels-repository";
import { notFoundError, paymentRequiredError } from "@/errors";
import ticketsRepository from "@/repositories/tickets-repository";
import enrollmentRepository from "@/repositories/enrollment-repository";
import { TicketStatus } from "@prisma/client";

export async function getHotels(userId: number){
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if(!enrollment){
    console.log('throw enrollment')
    throw notFoundError();
  }
  const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);
  if(!ticket){
    console.log('throw ticket')
    throw notFoundError();
  };
  if(ticket.status === TicketStatus.RESERVED
    || ticket.TicketType.isRemote === true
    || ticket.TicketType.includesHotel === false) throw paymentRequiredError();
 
    const result = await hotelRepositories.getHotels();
    if(result.length === 0 || !result || result === null){
      throw notFoundError();
    };
  return result;
};

export async function getHotelsRooms(hotelId: number, userId: number) {
    const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
    if(!enrollment){
      console.log('throw enrollment id')
      throw notFoundError();
      
    }
    const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);
    if(!ticket){
      console.log('throw ticket id')
      throw notFoundError();
    };
    if(ticket.status === TicketStatus.RESERVED 
      || ticket.TicketType.isRemote === true
      || ticket.TicketType.includesHotel === false){
        throw paymentRequiredError();
    };
    const hotel = await hotelRepositories.getHotelsRooms(hotelId);
    if(!hotel){
      throw notFoundError();
    }
    return hotel;
}