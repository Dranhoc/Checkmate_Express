import { Router } from 'express';
import tournamentController from '../controllers/tournament.controller.js';
import { connected } from '../middlewares/auth.middleware.js';
import { bodyValidator } from '../middlewares/validator.middleware.js';
import { createTournamentValidator } from '../validators/tournament.validator.js';

const tournamentRouter = Router();

tournamentRouter.post('/', connected('admin'), bodyValidator(createTournamentValidator), tournamentController.create);
//TODO Ajouter le validator
tournamentRouter.get('/', tournamentController.getAll);
// tournamentRouter.get('/', queryValidator(getAllTournamentQueryValidator), tournamentController.getAll);

export default tournamentRouter;
