import { Router } from 'express';
import concertController from '../controllers/concert.controller.js';
import { connected } from '../middlewares/auth.middleware.js';
import { bodyValidator, queryValidator } from '../middlewares/validator.middleware.js';
import { createConcertValidator, getAllConcertQueryValidator } from '../validators/concert.validator.js';

const concertRouter = Router();

concertRouter.post('/', connected(['admin', 'organizer']), bodyValidator(createConcertValidator), concertController.create);
//TODO Ajouter le validator
concertRouter.get('/', queryValidator(getAllConcertQueryValidator), concertController.getAll);
concertRouter.delete('/:id', connected(['admin', 'organizer']), concertController.delete);

export default concertRouter;
