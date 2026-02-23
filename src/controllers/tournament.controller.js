import { TournamentListingDTO } from '../dtos/tournament.dto.js';
import tournamentService from '../services/tournament.service.js';

const tournamentController = {
	create: async (req, res) => {
		const tournament = await tournamentService.create(req.data, req.user.id);
		const dto = new TournamentListingDTO(tournament);
		res.status(201).json({ data: dto });
	},

	getAll: async (req, res) => {
		// const { id, name, location, playerMin, playerMax, eloMin, eloMax, endDate, currentRound, isWomanOnly} = req.query
		const data = await tournamentService.getAll();
		res.status(200).json(data);
	},
	// getAll: async (req, res) => {
	// 	const { name, fromPrice, toPrice, fromDate, orderByName, orderByDate, orderByPrice, offset, limit } = req.validatedQuery;

	// 	const filter = { name, fromPrice, toPrice, fromDate };
	// 	const pagination = {
	// 		orders: {
	// 			price: orderByPrice,
	// 			date: orderByDate,
	// 			name: orderByName,
	// 		},
	// 		limit,
	// 		offset,
	// 	};
	// 	const concerts = await concertService.getAll(filter, pagination);
	// 	const dtos = concerts.map((c) => new ConcertListingDTO(c));

	// 	res.status(200).json({ data: dtos });
	// },

	// delete: async (req, res) => {
	// 	await concertService.delete(req.params.id, req.user);

	// 	res.status(204).send();
	// },
};

export default tournamentController;
