import { Test, TestingModule } from '@nestjs/testing';
import { HaircutsService } from './haircuts.service';
import { PrismaService } from '../prisma/prisma.service';

const mockPrismaService = {
    haircut: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        count: jest.fn(),
    },
};

describe('HaircutsService', () => {
    let service: HaircutsService;
    let prisma: PrismaService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                HaircutsService,
                {
                    provide: PrismaService,
                    useValue: mockPrismaService,
                },
            ],
        }).compile();

        service = module.get<HaircutsService>(HaircutsService);
        prisma = module.get<PrismaService>(PrismaService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('findAll', () => {
        it('should return an array of haircuts', async () => {
            const result = {
                data: [{ id: 1, title: 'Test' }],
                meta: { total: 1, page: 1, last_page: 1 }
            };
            mockPrismaService.haircut.findMany.mockResolvedValue([{ id: 1, title: 'Test' }]);
            mockPrismaService.haircut.count.mockResolvedValue(1);

            expect(await service.findAll(1, 10)).toEqual(result);
        });
    });

    describe('findOne', () => {
        it('should return a single haircut', async () => {
            const result = { id: 1, title: 'Test' };
            mockPrismaService.haircut.findUnique.mockResolvedValue(result);

            expect(await service.findOne('1')).toEqual(result);
        });
    });

    describe('create', () => {
        it('should create a new haircut', async () => {
            const dto = { title: 'New Cut', description: 'Desc', price: 20, tags: 'tag1' };
            const files = [];
            const result = { id: 1, ...dto, price: 20, imageUrls: [] };

            mockPrismaService.haircut.create.mockResolvedValue(result);

            expect(await service.create(dto, files)).toEqual(result);
        });
    });
});
