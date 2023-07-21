import { prisma } from "@/config";

export async function getBooking(userId: number){
    return prisma.booking.findFirst({
        where: {
            userId
        },
        select: {
            id: true,
            Room: true
        }
    });
};

export async function createBooking(){

};

export async function updateBooking(){

};