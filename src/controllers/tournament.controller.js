import { TournamentListingDTO } from '../dtos/tournament.dto.js';
import tournamentService from '../services/tournament.service.js';

const tournamentController = {
	create: async (req, res) => {
		const tournament = await tournamentService.create(req.data);
		res.status(201).json({ tournament });
	},

	getAll: async (req, res) => {
		const { name, status, category, elo, fromElo, toElo, fromDate, toDate, orderByUpdateDate, canRegister, isRegistered, offset, limit } = req.validatedQuery;

		const filter = { name, status, category, elo, fromElo, toElo, fromDate, toDate, canRegister, isRegistered };
		const pagination = {
			orders: {
				date: orderByUpdateDate,
			},
			limit,
			offset,
		};
		const tournaments = await tournamentService.getAll(filter, pagination);
		const tournamentsDTO = tournaments.map((tournament) => new TournamentListingDTO(tournament));
		res.status(200).json(tournamentsDTO);
	},
	getById: async (req, res) => {
		const { id } = req.params;
		const tournament = await tournamentService.getById(id);
		const tournamentDTO = new TournamentListingDTO(tournament);
		res.status(200).json(tournamentDTO);
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

	// 	const concerts = await concertService.getAll(filter, pagination);
	// 	const dtos = concerts.map((c) => new ConcertListingDTO(c));

	// 	res.status(200).json({ data: dtos });
	// },
};

export default tournamentController;
