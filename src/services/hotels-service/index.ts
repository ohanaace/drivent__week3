import * as hotelRepositories from "@/repositories/hotels-repository";
import { notFoundError } from "@/errors";
import ticketsRepository from "@/repositories/tickets-repository";
import enrollmentRepository from "@/repositories/enrollment-repository";
import { paymentRequiredError } from "@/errors/payment-required-error";

export async function getHotels(userId: number){
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if(!enrollment){
    throw notFoundError();
  }
  const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);
  if(!ticket){
    throw notFoundError();
  };
  if(ticket.status !== 'PAID' 
    || ticket.TicketType.isRemote 
    || ticket.TicketType.includesHotel === false){
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
    if(ticket.status !== 'PAID' 
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