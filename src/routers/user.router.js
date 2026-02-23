import { Router } from 'express';
import userController from '../controllers/user.controller.js';
import { connected } from '../middlewares/auth.middleware.js';

const userRouter = Router();

// http://localhost:8080/user
userRouter.get('/', connected(['admin']), userController.getAll);

export default userRouter;
