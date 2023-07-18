import { prisma } from "@/config";
import faker from "@faker-js/faker";

export async function createHotel(){
    return await prisma.hotel.create({
        data: {
            image: faker.image.business(),
            name: faker.company.companyName(),
        }
    });
};

export async function createHotelWithRooms(hotelId: number){
    return await prisma.room.create({
        data: {
            name: faker.datatype.number().toString(),
            capacity: faker.datatype.number(),
            hotelId
        }
    });
};