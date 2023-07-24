import * as bookingService from "@/services/booking-service";
import enrollmentRepository from "@/repositories/enrollment-repository";
import ticketsRepository from "@/repositories/tickets-repository";
import { Enrollment, Ticket, TicketType, Address } from "@prisma/client";
import faker from "@faker-js/faker";
import { forbiddenError } from "@/errors";

beforeEach(() => {
    jest.clearAllMocks();
});


describe("Unit tests - check user ticket", () => {
    it('should throw an error if ticket status is RESERVED', async () => {

        const enrollmentMock: Enrollment & { Address: Address[] } = {
            id: 1,
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
                enrollmentId: 1,
                createdAt: new Date(),
                updatedAt: new Date()
            }]
        }
        jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockResolvedValueOnce(enrollmentMock);

        const mockTicket: Ticket & { TicketType: TicketType } = {
            id: 1,
            ticketTypeId: 1,
            enrollmentId: 1,
            status: 'RESERVED',
            createdAt: new Date(),
            updatedAt: new Date(),
            TicketType: {
                id: 1,
                name: faker.lorem.word(),
                price: faker.datatype.number(),
                includesHotel: true,
                isRemote: false,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        };
        jest.spyOn(ticketsRepository, 'findTicketByEnrollmentId').mockResolvedValueOnce(mockTicket);
        const promise = bookingService.createBooking(1, 1);
        expect(promise).rejects.toEqual({
            name: 'ForbiddenError',
            message: 'You cannot complete this operation'
          });
    });

    it('should throw an error if ticket does not include hotel', async () => {

        const enrollmentMock: Enrollment & { Address: Address[] } = {
            id: 1,
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
                enrollmentId: 1,
                createdAt: new Date(),
                updatedAt: new Date()
            }]
        };
        jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockResolvedValueOnce(enrollmentMock);

        const mockTicket: Ticket & { TicketType: TicketType } = {
            id: 1,
            ticketTypeId: 1,
            enrollmentId: 1,
            status: 'PAID',
            createdAt: new Date(),
            updatedAt: new Date(),
            TicketType: {
                id: 1,
                name: faker.lorem.word(),
                price: faker.datatype.number(),
                includesHotel: false,
                isRemote: false,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        };
        jest.spyOn(ticketsRepository, 'findTicketByEnrollmentId').mockResolvedValueOnce(mockTicket);
        const promise = bookingService.createBooking(1, 1);
        expect(promise).rejects.toEqual({
            name: 'ForbiddenError',
            message: 'You cannot complete this operation'
          });
    });

    it('should throw an error if ticket is remote', async () => {

        const enrollmentMock: Enrollment & { Address: Address[] } = {
            id: 1,
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
                enrollmentId: 1,
                createdAt: new Date(),
                updatedAt: new Date()
            }]
        };
        jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockResolvedValueOnce(enrollmentMock);

        const mockTicket: Ticket & { TicketType: TicketType } = {
            id: 1,
            ticketTypeId: 1,
            enrollmentId: 1,
            status: 'PAID',
            createdAt: new Date(),
            updatedAt: new Date(),
            TicketType: {
                id: 1,
                name: faker.lorem.word(),
                price: faker.datatype.number(),
                includesHotel: false,
                isRemote: true,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        };
        jest.spyOn(ticketsRepository, 'findTicketByEnrollmentId').mockResolvedValueOnce(mockTicket);
        const promise = bookingService.createBooking(1, 1);
        expect(promise).rejects.toEqual({
            name: 'ForbiddenError',
            message: 'You cannot complete this operation'
          });
    });
});