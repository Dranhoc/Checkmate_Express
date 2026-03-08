import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from '../config/swagger.config.js';

import authRouter from './auth.router.js';
import userRouter from './user.router.js';
import tournamentRouter from './tournament.router.js';

const router = Router();

router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

router.use('/auth', authRouter);
router.use('/user', userRouter);
router.use('/tournament', tournamentRouter);

export default router;
