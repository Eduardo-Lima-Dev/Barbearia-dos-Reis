import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface TokenPayload {
    sub: string;
    role: 'BARBER' | 'EMPLOYEE';
}

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
    const authToken = req.headers.authorization;

    if (!authToken) {
        return res.status(401).json({ error: 'Token is missing' });
    }

    const [, token] = authToken.split(' ');

    try {
        const { sub, role } = jwt.verify(
            token,
            process.env.JWT_SECRET as string
        ) as TokenPayload;

        req.user = {
            id: sub,
            role,
        };

        return next();
    } catch (err) {
        return res.status(401).json({ error: 'Token is invalid' });
    }
}
