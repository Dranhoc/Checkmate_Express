import tournamentService from '../services/tournament.service.js';

const tournamentController = {
	create: async (req, res) => {
		const tournament = await tournamentService.create(req.data);
		res.status(201).json({ tournament });
	},

	getAll: async (req, res) => {
		const data = await tournamentService.getAll();
		res.status(200).json(data);
	},
	delete: async (req, res) => {
		const { id } = req.params;
		const tournament = await tournamentService.delete(id);
		res.status(200).json({ tournament });
	},
	register: async (req, res) => {
		const { tournamentId } = req.params;
		const userId = req.user.id;
		console.log(`   --🚨 ${userId} 🚨--`);
		console.log(`   --🚨 ${tournamentId} 🚨--`);
		const data = await tournamentService.register(tournamentId, userId);
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
