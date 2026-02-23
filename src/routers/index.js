import { Router } from 'express';
import authRouter from './auth.router.js';
import userRouter from './user.router.js';
import concertRouter from './concert.router.js';

const router = Router();

// TODO routing des features
router.use('/auth', authRouter);
router.use('/user', userRouter);
router.use('/concert', concertRouter);

export default router;
