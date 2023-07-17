import httpStatus from 'http-status';
import supertest from 'supertest';
import { cleanDb, generateValidToken } from '../helpers';
import app, { init } from '@/app';
import faker from '@faker-js/faker';
import { createEnrollmentWithAddress, createHotel, createUser } from '../factories';
import * as jwt from 'jsonwebtoken';
import { Enrollment, User } from '@prisma/client';

beforeAll(async () => {
  await init();
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

    

    it('should respond with status 200 if there are listed hotels', async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        
        await createHotel()

        const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.OK);
    });
});