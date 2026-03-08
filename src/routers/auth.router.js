import { Router } from 'express';
import authController from '../controllers/auth.controller.js';
import { bodyValidator } from '../middlewares/validator.middleware.js';
import { registerValidator, loginValidator } from '../validators/auth.validator.js';

const authRouter = Router();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: User register (sign up)
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: admin@admin.com
 *               pseudo:
 *                 type: string
 *                 example: MisterCheckMate
 *               password:
 *                 type: string
 *                 example: Test1234=!
 *               birthDate:
 *                 type: string
 *                 format: date
 *                 example: 1998-02-18
 *               gender:
 *                 type: string
 *                 enum:
 *                   - male
 *                   - female
 *                   - other
 *                 example: "other"
 *     responses:
 *       200:
 *         description: Success
 */
authRouter.post('/register', bodyValidator(registerValidator), authController.register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: User login (sign in)
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: admin@admin.com
 *               pseudo:
 *                 type: string
 *                 example: MisterCheckMate
 *               password:
 *                 type: string
 *                 example: Test1234=!
 *             oneOf:
 *               - required: [email]
 *               - required: [username]
 *     responses:
 *       200:
 *         description: Success
 */
authRouter.post('/login', bodyValidator(loginValidator), authController.login);

export default authRouter;
