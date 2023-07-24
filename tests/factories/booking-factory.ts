import { prisma } from "@/config";

export async function createReservation(roomId: number, userId: number){
    return prisma.booking.create({
        data: {
            userId,
            roomId
        }
    });
};