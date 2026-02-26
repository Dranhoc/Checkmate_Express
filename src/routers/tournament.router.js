import { Router } from 'express';
import tournamentController from '../controllers/tournament.controller.js';
import { connected } from '../middlewares/auth.middleware.js';
import { bodyValidator, queryValidator } from '../middlewares/validator.middleware.js';
import { createTournamentValidator, getAllTournamentQueryValidator } from '../validators/tournament.validator.js';

const tournamentRouter = Router();

tournamentRouter.post('/', connected('admin'), bodyValidator(createTournamentValidator), tournamentController.create);
tournamentRouter.get('/', queryValidator(getAllTournamentQueryValidator), tournamentController.getAll);
tournamentRouter.post('/register/:tournamentId', connected(), tournamentController.register);
tournamentRouter.delete('/unsubscribe/:tournamentId', connected(), tournamentController.unsubscribe);
tournamentRouter.get('/:id', connected(), tournamentController.getById);
tournamentRouter.delete('/:id', connected('admin'), tournamentController.delete);

export default tournamentRouter;
