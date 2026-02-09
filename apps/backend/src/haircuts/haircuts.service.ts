import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateHaircutDto, UpdateHaircutDto } from './dto/haircut.dto';

@Injectable()
export class HaircutsService {
    constructor(private prisma: PrismaService) { }

    async create(createHaircutDto: CreateHaircutDto, files: Array<Express.Multer.File>) {
        const { title, description, price, tags } = createHaircutDto;

        // Process tags
        const tagList = tags ? tags.split(',').map(tag => tag.trim()) : [];

        // Create Haircut
        const haircut = await this.prisma.haircut.create({
            data: {
                title,
                description,
                price,
                tags: {
                    connectOrCreate: tagList.map(tag => ({
                        where: { name: tag },
                        create: { name: tag },
                    })),
                },
                images: {
                    create: files.map(file => ({
                        url: `/uploads/${file.filename}`,
                    })),
                },
            },
            include: { images: true, tags: true },
        });

        return haircut;
    }

    async findAll(page: number = 1, limit: number = 10) {
        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            this.prisma.haircut.findMany({
                skip,
                take: limit,
                include: { images: true, tags: true },
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.haircut.count(),
        ]);

        return {
            data,
            meta: {
                total,
                page,
                last_page: Math.ceil(total / limit),
            },
        };
    }

    async findOne(id: string) {
        const haircut = await this.prisma.haircut.findUnique({
            where: { id },
            include: { images: true, tags: true },
        });
        if (!haircut) throw new NotFoundException('Haircut not found');
        return haircut;
    }

    async update(id: string, updateHaircutDto: UpdateHaircutDto) {
        return this.prisma.haircut.update({
            where: { id },
            data: updateHaircutDto,
            include: { images: true, tags: true },
        });
    }

    async remove(id: string) {
        return this.prisma.haircut.delete({
            where: { id },
        });
    }
}
