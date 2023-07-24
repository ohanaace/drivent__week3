import { prisma } from "@/config";

export async function createReservation(roomId: number, userId: number){
    return prisma.booking.create({
        data: {
            userId,
            roomId
        }
    });
};

export async function getRoomCapacity(roomId: number){
    return prisma.room.findFirst({
        where: {
            id: roomId
        },
    })
};

export async function getReservations(roomId: number){
    return prisma.booking.count({
        where: {
            roomId
        }
    });
}