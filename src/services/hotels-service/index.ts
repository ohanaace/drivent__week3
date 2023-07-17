import * as hotelRepositories from "@/repositories/hotels-repository";
import { notFoundError, paymentRequiredError } from "@/errors";
import ticketsRepository from "@/repositories/tickets-repository";
import enrollmentRepository from "@/repositories/enrollment-repository";

export async function getHotels(userId: number){
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if(!enrollment){
    throw notFoundError();
  }
  const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);
  if(!ticket){
    throw notFoundError();
  };
  if(ticket.status === 'RESERVED' 
    || ticket.TicketType.isRemote 
    || !ticket.TicketType.includesHotel){
      throw paymentRequiredError();
  };
  const result = await hotelRepositories.getHotels();
    if(result.length === 0){
      throw notFoundError();
    };
  return result;
};

export async function getHotelsRooms(id: number, userId: number) {
    const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
    if(!enrollment){
      throw notFoundError();
    }
    const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);
    if(!ticket){
      throw notFoundError();
    };
    if(ticket.status === 'RESERVED' 
      || ticket.TicketType.isRemote 
      || ticket.TicketType.includesHotel === false){
        throw paymentRequiredError();
    };
    const hotel = await hotelRepositories.getHotelsRooms(id);
    if(!hotel){
      throw notFoundError();
    }
    return hotel;
}