import supertest from "supertest";
import app, { init } from "@/app";
import httpStatus from "http-status";
import faker from "@faker-js/faker";
import {
    createEnrollmentWithAddress,
    createHotel, createHotelWithRooms,
    createReservation, createTicket,
    createTicketTypeWithHotel,
    createUser,
    getRoomCapacity
} from "../factories";
import * as jwt from "jsonwebtoken";
import { cleanDb, generateValidToken } from "../helpers";
import { Booking, Enrollment, Hotel, Room, TicketStatus, User } from "@prisma/client";
import { any } from "joi";

const server = supertest(app);

beforeAll(async () => {
    await init();
});

beforeEach(async () => {
    await cleanDb();
});

describe("GET method /booking => Authorization issues", () => {
    it('should respond with status 401 if no token is given', async () => {
        const { status } = await server.get("/booking");

        expect(status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('should respond with status 401 if token given is not valid', async () => {
        const token = faker.lorem.word();
        const { status } = await server.get("/booking").set("Authorization", `Bearer ${token}`);

        expect(status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('should respond with status 401 if there is no session for given token', async () => {
        const user = await createUser()
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
        const { status } = await server.get("/booking").set('Authorization', `Bearer ${token}`);

        expect(status).toBe(httpStatus.UNAUTHORIZED);
    });
});

describe("GET method /booking => When token is valid", () => {
    let token: string;
    let user: User;
    let enrollment: Enrollment;
    let hotel: Hotel;
    let rooms: Room;
    beforeEach(async () => {
        hotel = await createHotel()
        user = await createUser();
        token = await generateValidToken(user);
        enrollment = await createEnrollmentWithAddress(user)
        rooms = await createHotelWithRooms(hotel.id)
    });
    it('should respond with status 404 if user has no reservation', async () => {
        const { status } = await server.get("/booking").set("Authorization", `Bearer ${token}`);

        expect(status).toBe(httpStatus.NOT_FOUND);
    });

    it('should respond with status 200 and booking info if user has a reservation', async () => {
        const validTicket = await createTicketTypeWithHotel();
        const ticket = await createTicket(enrollment.id, validTicket.id, TicketStatus.PAID);
        const booking = await createReservation(rooms.id, user.id)

        const { status, body } = await server.get("/booking").set("Authorization", `Bearer ${token}`);

        expect(status).toBe(httpStatus.OK);

        expect(body).toHaveProperty('id', booking.id);
    });
});

describe("POST method /booking", () => {
    let token: string;
    let user: User;
    let enrollment: Enrollment;
    let hotel: Hotel;
    let rooms: Room;
    beforeEach(async () => {
        hotel = await createHotel()
        user = await createUser();
        token = await generateValidToken(user);
        enrollment = await createEnrollmentWithAddress(user)
        rooms = await createHotelWithRooms(hotel.id)
    });

    it('should respond with status 400 if body is not given',async () => {
        const validTicket = await createTicketTypeWithHotel();
        await createTicket(enrollment.id, validTicket.id, TicketStatus.PAID);
        
        const result = await server.post("/booking").set("Authorization", `Bearer ${token}`);
        
        expect(result.status).toBe(httpStatus.BAD_REQUEST)
    });

    it('should respond with status 404 if room does not exist',async () => {
        const validTicket = await createTicketTypeWithHotel();
        await createTicket(enrollment.id, validTicket.id, TicketStatus.PAID);
        const body = {
            roomId: rooms.id - 2
        }
        const result = await server.post("/booking").set("Authorization", `Bearer ${token}`).send(body);

        expect(result.status).toBe(httpStatus.NOT_FOUND)
    });

    it('should respond with status 200 and bookingId if user books a room', async () => {
        const validTicket = await createTicketTypeWithHotel();
        await createTicket(enrollment.id, validTicket.id, TicketStatus.PAID);
        const body = {
            roomId: rooms.id
        }
        const result = await server.post("/booking").set("Authorization", `Bearer ${token}`).send(body);

        expect(result.status).toBe(httpStatus.OK);
        expect(result.body).toHaveProperty('bookingId');
    });
});

describe("PUT method /booking/:bookingId", () => {
    let token: string;
    let user: User;
    let enrollment: Enrollment;
    let hotel: Hotel;
    let rooms: Room;
    let booking: Booking
    beforeEach(async () => {
        hotel = await createHotel()
        user = await createUser();
        token = await generateValidToken(user);
        enrollment = await createEnrollmentWithAddress(user);
        rooms = await createHotelWithRooms(hotel.id);
        booking = await createReservation(rooms.id, user.id);
    });

    it('should respond with status 400 if no body is given', async () => {
       const validTicket = await createTicketTypeWithHotel();
       await createTicket(enrollment.id, validTicket.id, TicketStatus.PAID);
       
       const result = await server.put(`/booking/${booking.id}`).set("Authorization", `Bearer ${token}`);

       expect(result.status).toBe(httpStatus.BAD_REQUEST);
    });

    it('should respond with status 404 if new room id does not exist', async () => {
        const validTicket = await createTicketTypeWithHotel();
        await createTicket(enrollment.id, validTicket.id, TicketStatus.PAID);

        const body = {
            roomId: 0
        };

        const result = await server.put(`/booking/${booking.id}`).set("Authorization", `Bearer ${token}`).send(body);

        expect(result.status).toBe(httpStatus.NOT_FOUND);
    });

    it('should respond with status 200 and new bookingId if user updates booking',async () => {
        const newRoom = await createHotelWithRooms(hotel.id);

        const validTicket = await createTicketTypeWithHotel();
        await createTicket(enrollment.id, validTicket.id, TicketStatus.PAID);

        const body = {
            roomId: newRoom.id
        };

        const result = await server.put(`/booking/${booking.id}`).set("Authorization", `Bearer ${token}`).send(body);

        expect(result.status).toBe(httpStatus.OK);
        expect(result.body).toHaveProperty('bookingId');
    });
});