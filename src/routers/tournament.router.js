import { Router } from 'express';
import tournamentController from '../controllers/tournament.controller.js';
// import { connected } from '../middlewares/auth.middleware.js';
import { bodyValidator } from '../middlewares/validator.middleware.js';
import { createTournamentValidator } from '../validators/tournament.validator.js';

const tournamentRouter = Router();

tournamentRouter.post('/', bodyValidator(createTournamentValidator), tournamentController.create);
// tournamentRouter.post('/', connected(['admin', 'organizer']), bodyValidator(createTournamentValidator), tournamentController.create);
//TODO Ajouter le validator
tournamentRouter.get('/', tournamentController.getAll);
// tournamentRouter.get('/', queryValidator(getAllTournamentQueryValidator), tournamentController.getAll);

export default tournamentRouter;
