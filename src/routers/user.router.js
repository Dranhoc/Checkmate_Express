import { Router } from 'express';
import userController from '../controllers/user.controller.js';
import { connected } from '../middlewares/auth.middleware.js';

const userRouter = Router();

/**
 * @swagger
 * /user/:
 *   post:
 *     summary: Get all users
 *     tags: [User]
 *     responses:
 *       200:
 *         description: Success
 */
userRouter.get('/', connected(true), userController.getAll);

export default userRouter;
