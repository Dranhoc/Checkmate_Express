import { Router } from 'express';
import tournamentController from '../controllers/tournament.controller.js';
import { connected } from '../middlewares/auth.middleware.js';
import { bodyValidator, queryValidator } from '../middlewares/validator.middleware.js';
import { createTournamentValidator, getAllTournamentQueryValidator, updateMatchValidator } from '../validators/tournament.validator.js';

const tournamentRouter = Router();

tournamentRouter.post('/', connected(true), bodyValidator(createTournamentValidator), tournamentController.create);
tournamentRouter.get('/', queryValidator(getAllTournamentQueryValidator), tournamentController.getAll);
tournamentRouter.post('/register/:tournamentId', connected(), tournamentController.register);
tournamentRouter.delete('/unsubscribe/:tournamentId', connected(), tournamentController.unsubscribe);
tournamentRouter.post('/start/:tournamentId', connected(true), tournamentController.start);
tournamentRouter.put('/match/:matchId', bodyValidator(updateMatchValidator), connected(true), tournamentController.updateMatch);
tournamentRouter.post('/next-round/:tournamentId', connected(true), tournamentController.nextRound);
tournamentRouter.get('/score/:tournamentId', connected(), tournamentController.getScore);
tournamentRouter.get('/:id', connected(), tournamentController.getById);
tournamentRouter.delete('/:id', connected(true), tournamentController.delete);

export default tournamentRouter;
