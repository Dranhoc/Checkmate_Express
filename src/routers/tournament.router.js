import { Router } from 'express';
import tournamentController from '../controllers/tournament.controller.js';
import { connected } from '../middlewares/auth.middleware.js';
import { bodyValidator, queryValidator } from '../middlewares/validator.middleware.js';
import { createTournamentValidator, getAllTournamentQueryValidator, updateMatchValidator } from '../validators/tournament.validator.js';

const tournamentRouter = Router();

/**
 * @swagger
 * /tournament/:
 *   post:
 *     summary: Admin creates a tournament
 *     tags: [Tournament]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Super Tournament
 *               location:
 *                 type: string
 *                 example: Montreal
 *               min_player:
 *                 type: integer
 *                 example: 2
 *               max_player:
 *                 type: integer
 *                 example: 32
 *               min_elo:
 *                 type: integer
 *                 example: 100
 *               max_elo:
 *                 type: integer
 *                 example: 3000
 *               woman_only:
 *                 type: boolean
 *                 example: false
 *               end_inscription_date:
 *                 type: string
 *                 format: date
 *                 example: 2027-02-18
 *                 description: By default Now + days(max_player)
 *     responses:
 *       200:
 *         description: Success
 */
tournamentRouter.post('/', connected(true), bodyValidator(createTournamentValidator), tournamentController.create);
/**
 * @swagger
 * /tournament/:
 *   get:
 *     summary: Everybody can get all tournaments
 *     tags: [Tournament]
 *     responses:
 *       200:
 *         description: Success
 */
tournamentRouter.get('/', queryValidator(getAllTournamentQueryValidator), tournamentController.getAll);
/**
 * @swagger
 * /tournament/register/{tournamentId}:
 *   post:
 *     summary: Connected user can register to a tournament
 *     tags: [Tournament]
 *     parameters:
 *       - in: path
 *         name: tournamentId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Tournament ID
 *     responses:
 *       200:
 *         description: Success
 */
tournamentRouter.post('/register/:tournamentId', connected(), tournamentController.register);
/**
 * @swagger
 * /tournament/unsubscribe/{tournamentId}:
 *   delete:
 *     summary: Connected user unsubscribe to a tournament
 *     tags: [Tournament]
 *     parameters:
 *       - in: path
 *         name: tournamentId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Tournament ID
 *     responses:
 *       200:
 *         description: Success
 */
tournamentRouter.delete('/unsubscribe/:tournamentId', connected(), tournamentController.unsubscribe);
/**
 * @swagger
 * /tournament/start/{tournamentId}:
 *   post:
 *     summary: Admin start for a tournament (create matches)
 *     tags: [Tournament]
 *     parameters:
 *       - in: path
 *         name: tournamentId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Tournament ID
 *     responses:
 *       200:
 *         description: Success
 */
tournamentRouter.post('/start/:tournamentId', connected(true), tournamentController.start);
/**
 * @swagger
 * /tournament/match/{matchId}:
 *   put:
 *     summary: Admin updates a match
 *     tags: [Match]
 *     parameters:
 *       - in: path
 *         name: tournamentId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Tournament ID
 *     responses:
 *       200:
 *         description: Success
 */
tournamentRouter.put('/match/:matchId', bodyValidator(updateMatchValidator), connected(true), tournamentController.updateMatch);
/**
 * @swagger
 * /tournament/next-round/{tournamentId}:
 *   post:
 *     summary: Admin launch tournament's next round
 *     tags: [Tournament]
 *     parameters:
 *       - in: path
 *         name: tournamentId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Tournament ID
 *     responses:
 *       200:
 *         description: Success
 */
tournamentRouter.post('/next-round/:tournamentId', connected(true), tournamentController.nextRound);
/**
 * @swagger
 * /tournament/score/{tournamentId}:
 *   get:
 *     summary: Connected user can get the tournament's score
 *     tags: [Tournament]
 *     parameters:
 *       - in: path
 *         name: tournamentId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Tournament ID
 *     responses:
 *       200:
 *         description: Success
 */
tournamentRouter.get('/score/:tournamentId', connected(), tournamentController.getScore);
/**
 * @swagger
 * /tournament/{id}:
 *   get:
 *     summary: Connected user can see informations from a tournament
 *     tags: [Tournament]
 *     parameters:
 *       - in: path
 *         name: tournamentId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Tournament ID
 *     responses:
 *       200:
 *         description: Success
 */
tournamentRouter.get('/:id', connected(), tournamentController.getById);
/**
 * @swagger
 * /tournament/{id}:
 *   delete:
 *     summary: Admin deletes a tournament
 *     tags: [Tournament]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Tournament ID
 *     responses:
 *       200:
 *         description: Success
 */
tournamentRouter.delete('/:id', connected(true), tournamentController.delete);

export default tournamentRouter;
