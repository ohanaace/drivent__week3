import { prisma } from "@/config";

export function getBooking(userId: number){
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

export function createBooking(roomId: number, userId: number){
return prisma.booking.create({
    data: {
        roomId,
        userId
    }
})
};

export function updateBooking(){

};


export function getRoomsInfo(roomId: number){
    return prisma.room.findFirst({
        where: {
            id: roomId
        }
    });
};

export function getReservations(roomId: number){
    return prisma.booking.count({
        where: {
            roomId
        }
    });
}