import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

describe('HaircutsController (e2e)', () => {
    let app: INestApplication;
    let prisma: PrismaService;
    let adminToken: string;
    let clientToken: string;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
        await app.init();

        prisma = app.get(PrismaService);

        // Setup Admin User
        const adminEmail = 'admin@e2e.com';
        await prisma.user.deleteMany({ where: { email: { in: [adminEmail, 'client@e2e.com'] } } });

        const adminUser = await prisma.user.create({
            data: {
                email: adminEmail,
                passwordHash: await bcrypt.hash('admin123', 10),
                role: 'ADMIN',
            },
        });

        const loginRes = await request(app.getHttpServer())
            .post('/auth/login')
            .send({ email: adminEmail, password: 'admin123' });
        adminToken = loginRes.body.access_token;
    });

    afterAll(async () => {
        await prisma.haircut.deleteMany({ where: { title: 'Test Haircut' } });
        await prisma.user.deleteMany({ where: { email: { in: ['admin@e2e.com', 'client@e2e.com'] } } });
        await app.close();
    });

    let haircutId: number;

    it('/haircuts (POST) - Create Haircut (Admin)', () => {
        return request(app.getHttpServer())
            .post('/haircuts')
            .set('Authorization', `Bearer ${adminToken}`)
            .field('title', 'Test Haircut')
            .field('description', 'Description for test')
            .field('price', 30.00)
            .attach('files', Buffer.from('fakeimage'), 'test.jpg') // Simulando upload
            .expect(201)
            .expect((res) => {
                expect(res.body.title).toEqual('Test Haircut');
                expect(res.body.id).toBeDefined();
                haircutId = res.body.id;
            });
    });

    it('/haircuts (POST) - Create Haircut (No Token) - Fail', () => {
        return request(app.getHttpServer())
            .post('/haircuts')
            .send({ title: 'Fail' })
            .expect(401); // Unauthorized
    });

    it('/haircuts (GET) - List Haircuts', () => {
        return request(app.getHttpServer())
            .get('/haircuts')
            .expect(200)
            .expect((res) => {
                expect(Array.isArray(res.body.data)).toBe(true);
                const found = res.body.data.find((h: any) => h.id === haircutId);
                expect(found).toBeDefined();
            });
    });

    it('/haircuts/:id (PATCH) - Update Haircut (Admin)', () => {
        return request(app.getHttpServer())
            .patch(`/haircuts/${haircutId}`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ price: 35.00 })
            .expect(200)
            .expect((res) => {
                expect(res.body.price).toBe(35);
            });
    });

    it('/haircuts/:id (DELETE) - Delete Haircut (Admin)', () => {
        return request(app.getHttpServer())
            .delete(`/haircuts/${haircutId}`)
            .set('Authorization', `Bearer ${adminToken}`)
            .expect(200);
    });
});
