import { prisma } from '@/config';

export function getHotels() {
    return prisma.hotel.findMany({});
};

export function getHotelsRooms(id: number){
    return prisma.hotel.findUnique({
        where: {
            id
        },
        include: {
            Rooms: true
        }
    });
}