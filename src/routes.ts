import { Router } from 'express';
import { AuthController } from './controllers/auth.controller';
import { HaircutController } from './controllers/haircut.controller';
import { authMiddleware } from './middlewares/auth.middleware';
import { roleMiddleware } from './middlewares/role.middleware';

const routes = Router();

const authController = new AuthController();
const haircutController = new HaircutController();

// Auth Routes
routes.post('/register', authController.register);
routes.post('/login', authController.login);

// Haircut Routes
routes.use('/haircuts', authMiddleware);
routes.post('/haircuts', roleMiddleware(['BARBER', 'EMPLOYEE']), haircutController.create);
routes.get('/haircuts', roleMiddleware(['BARBER', 'EMPLOYEE']), haircutController.list);
routes.put('/haircuts/:id', roleMiddleware(['BARBER']), haircutController.update);
routes.delete('/haircuts/:id', roleMiddleware(['BARBER']), haircutController.delete);

export { routes };
