import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('AuthController (e2e)', () => {
    let app: INestApplication;
    let prisma: PrismaService;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
        await app.init();

        prisma = app.get(PrismaService);
        // Clean up database before tests (Optional, be careful in prod/dev env)
        // await prisma.user.deleteMany({ where: { email: 'test@e2e.com' } }); 
    });

    afterAll(async () => {
        // Cleanup specific test user
        await prisma.user.deleteMany({ where: { email: 'test@e2e.com' } });
        await app.close();
    });

    it('/auth/register (POST) - Success', () => {
        return request(app.getHttpServer())
            .post('/auth/register')
            .send({
                email: 'test@e2e.com',
                password: 'password123',
            })
            .expect(201)
            .expect((res) => {
                expect(res.body.id).toBeDefined();
                expect(res.body.email).toEqual('test@e2e.com');
            });
    });

    it('/auth/login (POST) - Success', () => {
        return request(app.getHttpServer())
            .post('/auth/login')
            .send({
                email: 'test@e2e.com',
                password: 'password123',
            })
            .expect(201)
            .expect((res) => {
                expect(res.body.access_token).toBeDefined();
            });
    });

    it('/auth/login (POST) - Fail (Wrong Password)', () => {
        return request(app.getHttpServer())
            .post('/auth/login')
            .send({
                email: 'test@e2e.com',
                password: 'wrongpassword',
            })
            .expect(401);
    });
});
