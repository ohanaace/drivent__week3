import { prisma } from '@/config';

export function getHotels() {
    return prisma.hotel.findMany({});
};

export function getHotelsRooms(hotelId: number){
    return prisma.hotel.findFirst({
        where: {
            id: hotelId
        },
        include: {
            Rooms: true
        }
    });
};