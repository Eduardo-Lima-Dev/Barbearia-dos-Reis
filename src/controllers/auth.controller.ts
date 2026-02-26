import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma';
import { z } from 'zod';

export class AuthController {
    async register(req: Request, res: Response) {
        try {
            const registerSchema = z.object({
                name: z.string().min(1),
                email: z.string().email(),
                password: z.string().min(6),
                role: z.enum(['BARBER', 'EMPLOYEE']).optional().default('EMPLOYEE'),
            });

            const data = registerSchema.parse(req.body);

            const userExists = await prisma.user.findUnique({
                where: { email: data.email },
            });

            if (userExists) {
                return res.status(400).json({ error: 'User already exists' });
            }

            const hashedPassword = await bcrypt.hash(data.password, 10);

            const user = await prisma.user.create({
                data: {
                    ...data,
                    password: hashedPassword,
                },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                    createdAt: true,
                },
            });

            return res.status(201).json(user);
        } catch (error) {
            if (error instanceof z.ZodError) {
                return res.status(400).json({ error: error.format() });
            }
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    async login(req: Request, res: Response) {
        try {
            const loginSchema = z.object({
                email: z.string().email(),
                password: z.string(),
            });

            const { email, password } = loginSchema.parse(req.body);

            const user = await prisma.user.findUnique({
                where: { email },
            });

            if (!user) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            const passwordMatch = await bcrypt.compare(password, user.password);

            if (!passwordMatch) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            const token = jwt.sign(
                { role: user.role },
                process.env.JWT_SECRET as string,
                {
                    subject: user.id,
                    expiresIn: '7d',
                }
            );

            return res.json({
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                },
                token,
            });
        } catch (error) {
            if (error instanceof z.ZodError) {
                return res.status(400).json({ error: error.format() });
            }
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
}
