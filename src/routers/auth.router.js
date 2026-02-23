import { Router } from 'express';
import authController from '../controllers/auth.controller.js';
import { bodyValidator } from '../middlewares/validator.middleware.js';
import { registerValidator, loginValidator } from '../validators/auth.validator.js';

const authRouter = Router();

// http://localhost:8080/auth/register
authRouter.post('/register', bodyValidator(registerValidator), authController.register);

// http://localhost:8080/auth/login
authRouter.post('/login', bodyValidator(loginValidator), authController.login);

export default authRouter;
