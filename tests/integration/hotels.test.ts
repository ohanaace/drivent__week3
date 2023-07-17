import httpStatus from 'http-status';
import supertest from 'supertest';
import { cleanDb, generateValidToken } from '../helpers';
import app, { init } from '@/app';
import faker from '@faker-js/faker';
import { createEnrollmentWithAddress, 
    createHotel, 
    createHotelWithRooms, 
    createTicket, 
    createTicketType, 
    createTicketTypeRemote, 
    createTicketWithoutHotel, 
    createUser } from '../factories';
import * as jwt from 'jsonwebtoken';
import { Enrollment, Hotel, Room, TicketStatus, User } from '@prisma/client';

beforeAll(async () => {
    await init();
  });
  
  beforeEach(async () => {
    await cleanDb();
  });
const server = supertest(app);

describe('GET /hotels - authorization issues', () => {
    it('should respond with status 401 if no token is given', async () => {
        const response = await server.get('/hotels');

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('should respond with status 401 if token is invalid', async () => {
        const token = faker.lorem.word();
        const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('should respond with status 401 if there is no session for given token', async () => {
        const user = await createUser()
        const token = jwt.sign({userId: user.id}, process.env.JWT_SECRET);
        const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
});

describe('GET /hotels - when token is valid', () => {
    let token: string;
    let user: User;
    let enrollment: Enrollment;

    beforeEach(async () => {
        user = await createUser();
        token = await generateValidToken(user);
        enrollment = await createEnrollmentWithAddress(user)
    });
    it('should respond with status 404 if enrollment doesnt exist', async () => {

        const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.NOT_FOUND);
    });
    it('should respond with status 404 if ticket doesnt exist', async () => {

        const response = await server.get('/tickets/types').set('Authorization', `Bearer ${token}`)
    
        expect(response.status).toBe(httpStatus.NOT_FOUND);
    });
    it('should respond with status 404 if there are no hotels listed',async () => {
        const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(httpStatus.NOT_FOUND);    
    });

    it('should respond with status 402 if the ticket status is RESERVED',async () => {
        const ticketType = await createTicketType();
        await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);

        const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.PAYMENT_REQUIRED);
    });

    it('should respond with status 402 if ticket does not include hotel', async () => {
       const ticketWithoutHotel = await createTicketWithoutHotel();
       await createTicket(enrollment.id, ticketWithoutHotel.id, TicketStatus.PAID);
       
       const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

       expect(response.status).toBe(httpStatus.PAYMENT_REQUIRED);
    });

    it('should respond with status 402 if ticket event is remote', async () => {
        const remoteTicket = await createTicketTypeRemote();
        await createTicket(enrollment.id, remoteTicket.id, TicketStatus.PAID);

        const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.PAYMENT_REQUIRED);
    })

    it('should respond with status 200 if there are listed hotels', async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        
        await createHotel()

        const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.OK);
    });
});

describe('GET /hotels/:hotelId - authorization issues', () => {
    let hotel: Hotel
    beforeEach(async () => {
        hotel = await createHotel()
    });
    it('should respond with status 401 if no token is given', async () => {
        const response = await server.get(`${hotel.id}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('should respond with status 401 if token is invalid', async () => {
        const token = faker.lorem.word();
        const response = await server.get(`/hotels/${hotel.id}`).set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('should respond with status 401 if there is no session for given token', async () => {
        const user = await createUser()
        const token = jwt.sign({userId: user.id}, process.env.JWT_SECRET);
        const response = await server.get(`/hotels/${hotel.id}`).set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
});

describe('GET /hotels/:hotelId - when token is valid', () => {
    let token: string;
    let user: User;
    let enrollment: Enrollment;
    let hotel: Hotel;
    let rooms: Room
    beforeEach(async () => {
        hotel = await createHotel()
        user = await createUser();
        token = await generateValidToken(user);
        enrollment = await createEnrollmentWithAddress(user)
        rooms = await createHotelWithRooms(hotel.id)
    });
    it('should respond with status 404 if enrollment doesnt exist', async () => {

        const response = await server.get(`/hotels/${hotel.id}`).set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.NOT_FOUND);
    });
    it('should respond with status 404 if ticket doesnt exist', async () => {

        const response = await server.get('/tickets/types').set('Authorization', `Bearer ${token}`)
    
        expect(response.status).toBe(httpStatus.NOT_FOUND);
    });
    it('should respond with status 404 if hotel does not exist',async () => {
        const response = await server.get(`/hotels/${hotel.id + Math.random()}`).set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(httpStatus.NOT_FOUND);    
    });

    it('should respond with status 402 if the ticket status is RESERVED',async () => {
        const ticketType = await createTicketType();
        await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);

        const response = await server.get(`/hotels/${hotel.id}`).set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.PAYMENT_REQUIRED);
    });

    it('should respond with status 402 if ticket does not include hotel', async () => {
       const ticketWithoutHotel = await createTicketWithoutHotel();
       await createTicket(enrollment.id, ticketWithoutHotel.id, TicketStatus.PAID);
       
       const response = await server.get(`/hotels/${hotel.id}`).set('Authorization', `Bearer ${token}`);

       expect(response.status).toBe(httpStatus.PAYMENT_REQUIRED);
    });

    it('should respond with status 402 if ticket event is remote', async () => {
        const remoteTicket = await createTicketTypeRemote();
        await createTicket(enrollment.id, remoteTicket.id, TicketStatus.PAID);

        const response = await server.get(`/hotels/${hotel.id}`).set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.PAYMENT_REQUIRED);
    })

    it('should respond with status 200 if there are listed hotels', async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        
        await createHotel()

        const response = await server.get(`/hotels/${hotel.id}`).set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.OK);
    });
});