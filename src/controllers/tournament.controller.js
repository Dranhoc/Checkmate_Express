import { TournamentListingDTO } from '../dtos/tournament.dto.js';
import tournamentService from '../services/tournament.service.js';

const tournamentController = {
	create: async (req, res) => {
		const tournament = await tournamentService.create(req.data);
		const tournamentDTO = new TournamentListingDTO(tournament);
		res.status(201).json({ tournamentDTO });
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
		const tournaments = await tournamentService.getAll(filter, pagination, req.user);
		const tournamentsDTO = tournaments.map((tournament) => new TournamentListingDTO(tournament));
		res.status(200).json({ data: tournamentsDTO });
	},

	getById: async (req, res) => {
		const { id } = req.params;
		const tournament = await tournamentService.getById(id);
		const tournamentDTO = new TournamentListingDTO(tournament);
		res.status(200).json({ data: tournamentDTO });
	},

	delete: async (req, res) => {
		const { id } = req.params;
		const tournament = await tournamentService.delete(id);
		const tournamentDTO = new TournamentListingDTO(tournament);
		res.status(200).json({ data: tournamentDTO });
	},

	register: async (req, res) => {
		try {
			const { tournamentId } = req.params;
			const userId = req.user.id;
			const data = await tournamentService.register(tournamentId, userId);
			res.status(200).json({ message: data });
		} catch (error) {
			res.status(error.statusCode || 400).json({ error: error.message || 'Registration failed' });
		}
	},

	unsubscribe: async (req, res) => {
		const userId = req.user.id;
		const { tournamentId } = req.params;

		const data = await tournamentService.unsubscribe(tournamentId, userId);
		res.status(200).json({ message: 'subscription deleted' });
	},

	start: async (req, res) => {
		const { tournamentId } = req.params;
		const tournament = await tournamentService.start(tournamentId);
		const tournamentDTO = new TournamentListingDTO(tournament);
		res.status(200).json({ data: tournamentDTO });
	},

	updateMatch: async (req, res) => {
		const { matchId } = req.params;
		const match = await tournamentService.updateMatch(matchId, req.data);
		res.status(200).json({ data: match });
	},

	nextRound: async (req, res) => {
		const { tournamentId } = req.params;
		const tournament = await tournamentService.nextRound(tournamentId);
		const tournamentDTO = new TournamentListingDTO(tournament);
		res.status(200).json({ data: tournamentDTO });
	},

	getScore: async (req, res) => {
		const { tournamentId } = req.params;
		const leaderboard = await tournamentService.getScore(tournamentId);
		res.status(200).json({ data: leaderboard });
	},
};

export default tournamentController;
