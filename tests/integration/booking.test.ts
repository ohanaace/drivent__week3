import supertest from "supertest";
import app, { init } from "@/app";
import httpStatus from "http-status";
import faker from "@faker-js/faker";
import { createEnrollmentWithAddress, createUser } from "../factories";
import * as jwt from "jsonwebtoken";
import { cleanDb, generateValidToken } from "../helpers";
import { Enrollment, User } from "@prisma/client";

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

