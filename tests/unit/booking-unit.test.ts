import * as bookingService from "@/services/booking-service";
import enrollmentRepository from "@/repositories/enrollment-repository";
import ticketsRepository from "@/repositories/tickets-repository";
import bookingRepository from "@/repositories/booking-repository";
import { mockEnrollment, mockTicket } from "../factories/mock-factory";

beforeEach(() => {
    jest.clearAllMocks();
});


describe("Unit tests - check user ticket", () => {
    it('should throw an error if ticket status is RESERVED', async () => {

        const enrollmentMock = mockEnrollment();
        jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockResolvedValueOnce(enrollmentMock);

        const ticketMock = mockTicket('RESERVED', true, false);
        jest.spyOn(ticketsRepository, 'findTicketByEnrollmentId').mockResolvedValueOnce(ticketMock);
        const promise = bookingService.createBooking(1, 1);
        expect(promise).rejects.toEqual({
            name: 'ForbiddenError',
            message: 'You cannot complete this operation'
        });
    });

    it('should throw an error if ticket does not include hotel', async () => {

        const enrollmentMock = mockEnrollment();
        jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockResolvedValueOnce(enrollmentMock);

        const ticketMock = mockTicket('PAID', false, false);
        jest.spyOn(ticketsRepository, 'findTicketByEnrollmentId').mockResolvedValueOnce(ticketMock);
        const promise = bookingService.createBooking(1, 1);
        expect(promise).rejects.toEqual({
            name: 'ForbiddenError',
            message: 'You cannot complete this operation'
        });
    });

    it('should throw an error if ticket is remote', async () => {

        const enrollmentMock = mockEnrollment();
        jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockResolvedValueOnce(enrollmentMock);

        const ticketMock = mockTicket('PAID', false, true);
        jest.spyOn(ticketsRepository, 'findTicketByEnrollmentId').mockResolvedValueOnce(ticketMock);
        const promise = bookingService.createBooking(1, 1);
        expect(promise).rejects.toEqual({
            name: 'ForbiddenError',
            message: 'You cannot complete this operation'
        });
    });
});