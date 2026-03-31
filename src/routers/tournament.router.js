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
 *                 description: min 2 max 32
 *               max_player:
 *                 type: integer
 *                 example: 32
 *                 description: min 2 max 32
 *               min_elo:
 *                 type: integer
 *                 example: 100
 *                 description: min 0 max 3000
 *               max_elo:
 *                 type: integer
 *                 example: 3000
 *                 description: min 0 max 3000
 *               woman_only:
 *                 type: boolean
 *                 example: false
 *               category:
 *                 type: array
 *                 example: ["Junior", "Veteran"]
 *                 items:
 *                  type: string
 *                  enum:
 *                    - Junior
 *                    - Veteran
 *                    - Senior
 *                    - AllAges
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
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Filter by tournament name (partial match)
 *         example: Gold
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, ongoing, finished]
 *         description: Filter by status (default excludes finished)
 *         example: pending
 *       - in: query
 *         name: fromElo
 *         schema:
 *           type: integer
 *         description: Filter tournaments where min_elo >= fromElo (use with toElo)
 *         example: 100
 *       - in: query
 *         name: toElo
 *         schema:
 *           type: integer
 *         description: Filter tournaments where max_elo <= toElo (use with fromElo)
 *         example: 2000
 *       - in: query
 *         name: elo
 *         schema:
 *           type: integer
 *         description: Filter tournaments accessible for a specific elo rating
 *         example: 1200
 *       - in: query
 *         name: fromDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter by inscription end date range start (use with toDate)
 *         example: 2024-01-01
 *       - in: query
 *         name: toDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter by inscription end date range end (use with fromDate)
 *         example: 2024-12-31
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum: [Junior, Veteran, Senior, AllAges]
 *         description: Filter by category
 *         example: Senior
 *       - in: query
 *         name: canRegister
 *         schema:
 *           type: boolean
 *         description: Filter tournaments the authenticated user can register to
 *         example: true
 *       - in: query
 *         name: isRegistered
 *         schema:
 *           type: boolean
 *         description: Filter tournaments the authenticated user is already registered to
 *         example: false
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *         description: Pagination offset
 *         example: 0
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Pagination limit
 *         example: 10
 *       - in: query
 *         name: orders[date]
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *         description: Sort by date
 *         example: DESC
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
//TODO Doc !
tournamentRouter.get('/can-register/:tournamentId/user/:userId', connected(), tournamentController.canRegister);
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
//TODO Doc !
tournamentRouter.get('/score/matches/:tournamentId/:round', connected(), tournamentController.getMatches);
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
