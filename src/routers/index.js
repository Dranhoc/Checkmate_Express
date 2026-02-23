import { Router } from 'express';
// import authRouter from './auth.router.js';
// import userRouter from './user.router.js';
import tournamentRouter from './tournament.router.js';

const router = Router();

// TODO routing des features
// router.use('/auth', authRouter);
// router.use('/user', userRouter);
router.use('/tournament', tournamentRouter);

export default router;
