import * as bookingRepository from "@/repositories/booking-repository";

export async function getBooking(){
    await bookingRepository.getBooking();
};

export async function createBooking(){
    await bookingRepository.createBooking();
};

export async function updateBooking(){
    await bookingRepository.updateBooking();
};
