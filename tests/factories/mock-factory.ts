import faker from "@faker-js/faker"
import { Enrollment, Ticket, TicketType, Address, TicketStatus } from "@prisma/client";

export function mockEnrollment(): Enrollment & { Address: Address[] } {
    return {
        id: faker.datatype.number(),
        name: faker.lorem.word(),
        cpf: faker.lorem.word(),
        birthday: new Date(),
        phone: faker.lorem.word(),
        userId: faker.datatype.number(),
        createdAt: new Date(),
        updatedAt: new Date(),
        Address: [{
            id: faker.datatype.number(),
            cep: faker.lorem.word(),
            street: faker.lorem.word(),
            city: faker.lorem.word(),
            state: faker.lorem.word(),
            number: faker.lorem.word(),
            neighborhood: faker.lorem.word(),
            addressDetail: null,
            enrollmentId: faker.datatype.number(),
            createdAt: new Date(),
            updatedAt: new Date()
        }]
    }
};

export function mockTicket(TicketStatus: TicketStatus, includesHotel: boolean, isRemote: boolean): Ticket & { TicketType: TicketType } {
    return {
        id: 1,
        ticketTypeId: 1,
        enrollmentId: 1,
        status: TicketStatus,
        createdAt: new Date(),
        updatedAt: new Date(),
        TicketType: {
            id: 1,
            name: faker.lorem.word(),
            price: faker.datatype.number(),
            includesHotel,
            isRemote,
            createdAt: new Date(),
            updatedAt: new Date()
        }
    }
}