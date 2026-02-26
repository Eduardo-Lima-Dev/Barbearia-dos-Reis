import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { supabase } from '../lib/supabase';
import { z } from 'zod';

export class HaircutController {
    async create(req: Request, res: Response) {
        try {
            const createSchema = z.object({
                name: z.string().min(1),
                tags: z.array(z.string()).default([]),
                duration: z.number().positive(),
                description: z.string().optional(),
                modelUrl: z.string().url().optional(),
            });

            const data = createSchema.parse(req.body);

            // req.user has been populated by the authMiddleware
            if (!req.user) {
                return res.status(401).json({ error: 'User not authenticated' });
            }

            const haircut = await prisma.haircut.create({
                data: {
                    ...data,
                    createdById: req.user.id,
                },
            });

            return res.status(201).json(haircut);
        } catch (error) {
            if (error instanceof z.ZodError) {
                return res.status(400).json({ error: error.format() });
            }
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    async list(req: Request, res: Response) {
        try {
            const { tags } = req.query;
            let filter = {};

            if (tags) {
                // Ex: ?tags=fade,degrade
                const tagsArray = String(tags).split(',');
                filter = {
                    tags: {
                        hasSome: tagsArray,
                    },
                };
            }

            const haircuts = await prisma.haircut.findMany({
                where: filter,
            });

            return res.json(haircuts);
        } catch (error) {
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    async update(req: Request, res: Response) {
        try {
            const id = req.params.id as string;

            const updateSchema = z.object({
                name: z.string().min(1).optional(),
                tags: z.array(z.string()).optional(),
                duration: z.number().positive().optional(),
                description: z.string().optional(),
                modelUrl: z.string().url().optional(),
            });

            const data = updateSchema.parse(req.body);

            const haircut = await prisma.haircut.update({
                where: { id },
                data,
            });

            return res.json(haircut);
        } catch (error) {
            if (error instanceof z.ZodError) {
                return res.status(400).json({ error: error.format() });
            }
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    async delete(req: Request, res: Response) {
        try {
            const id = req.params.id as string;

            await prisma.haircut.delete({
                where: { id },
            });

            return res.status(204).send();
        } catch (error) {
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
}
