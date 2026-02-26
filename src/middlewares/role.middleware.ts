import { Request, Response, NextFunction } from 'express';

export function roleMiddleware(allowedRoles: Array<'BARBER' | 'EMPLOYEE'>) {
    return (req: Request, res: Response, next: NextFunction) => {
        const { user } = req;

        if (!user) {
            return res.status(401).json({ error: 'User not authenticated' });
        }

        if (!allowedRoles.includes(user.role)) {
            return res.status(403).json({ error: 'Access denied: insufficient permissions' });
        }

        return next();
    };
}
