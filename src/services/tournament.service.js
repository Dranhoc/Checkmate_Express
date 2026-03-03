import dayjs from 'dayjs';
import {
	DateNotFarEnoughError,
	MinELOOfPlayersError,
	MinNumberOfPlayersError,
	TournamentAlreadyStartedError,
	TournamentIdNotFoundError,
	TournamentIsOverError,
	TournamentMinPlayerNotReachError,
	TournamentNotExistError,
	TournamentRegistrationNotClosed,
	UserNotRegisteredError,
} from '../custom-errors/tournament.error.js';
import db from '../database/index.js';
import { Op } from 'sequelize';
import { CategoryNotFoundError } from '../custom-errors/category.error.js';
import { canRegister } from '../utils/tournamentRegister.utils.js';
import createMatches from '../utils/createMatches.utils.js';
import { MatchInfoMissingError, MatchNotGoodRoundError } from '../custom-errors/match.error.js';

const tournamentService = {
	create: async (payload) => {
		console.log(`   --👉 payload 👈--`, payload);

		const endDate = dayjs(payload.end_inscription_date);
		const creationDate = dayjs(payload.createdAt);
		const minPlayer = payload.min_player;
		const maxPlayer = payload.max_player;

		const minEndDate = creationDate.add(minPlayer, 'day');
		if (endDate < minEndDate) throw new DateNotFarEnoughError();
		if (minPlayer > maxPlayer) throw new MinNumberOfPlayersError();

		const minElo = payload.min_elo;
		const maxElo = payload.max_elo;
		if (minElo > maxElo) throw new MinELOOfPlayersError();

		const { categories, ...tournamentData } = payload;

		const newTournament = await db.Tournament.create(tournamentData);

		if (categories && Array.isArray(categories) && categories.length > 0) {
			for (const catName of categories) {
				const category = await db.Category.findByPk(catName);
				if (!category) {
					throw new CategoryNotFoundError();
				}
				await newTournament.addCategory(category);
			}
		}

		return newTournament;
	},

	delete: async (id) => {
		const tournament = await db.Tournament.findByPk(id);
		if (!tournament) {
			throw new TournamentIdNotFoundError();
		}
		if (tournament.status === 'pending') {
			await tournament.destroy();
			return `${tournament.name} successfully deleted`;
		} else {
			throw new TournamentAlreadyStartedError();
		}
	},

	getAll: async (filter, pagination, user) => {
		const where = {};
		const categoryWhere = {};

		if (filter) {
			if (filter.name) {
				where.name = { [Op.iLike]: `%${filter.name}%` };
			}

			if (filter.status) {
				where.status = filter.status;
			} else {
				where.status = { [Op.ne]: 'finished' };
			}

			if (filter.fromElo && filter.toElo && filter.fromElo <= filter.toElo) {
				where.min_elo = { [Op.gte]: filter.fromElo };
				where.max_elo = { [Op.lte]: filter.toElo };
			} else if (filter.elo) {
				where.min_elo = { [Op.lte]: filter.elo };
				where.max_elo = { [Op.gte]: filter.elo };
			}

			if (filter.fromDate && filter.toDate) {
				where.end_inscription_date = {
					[Op.between]: [filter.fromDate, filter.toDate],
				};
			}

			if (filter.category) {
				categoryWhere.name = filter.category;
			}

			if (filter.canRegister) {
				const tournaments = await db.Tournament.findAll({
					where: {
						status: 'pending',
					},
				});

				const allowedIds = [];

				for (const tournament of tournaments) {
					try {
						const canUserRegister = await canRegister(tournament.id, user.id);
						if (canUserRegister) {
							allowedIds.push(tournament.id);
						}
					} catch (error) {
						console.log(error);
					}
				}

				where.id = {
					[Op.in]: allowedIds,
				};
			}

			if (filter.isRegistered) {
				const tournaments = await db.Tournament.findAll({
					include: [
						{
							model: db.User,
							as: 'participant',
							where: { id: user.id },
						},
					],
				});

				where.id = { [Op.in]: tournaments.map((tournament) => tournament.id) };
			}
		}

		const order = [];
		if (pagination.orders?.date) {
			order.push(['updatedAt', pagination.orders.date]);
		}

		const tournaments = await db.Tournament.findAll({
			where,
			order,
			offset: pagination.offset,
			limit: pagination.limit,
			include: [
				{
					model: db.Category,
					as: 'category',
					where: Object.keys(categoryWhere).length > 0 ? categoryWhere : null,
					required: Object.keys(categoryWhere).length > 0,
				},
				{
					model: db.User,
					as: 'participant',
				},
			],
		});
		return tournaments;
	},

	getById: async (tournamentId) => {
		const tournament = await db.Tournament.findByPk(tournamentId, {
			include: [
				{ model: db.Category, as: 'category' },
				{ model: db.User, as: 'participant' },
			],
		});

		if (!tournament) throw new TournamentNotExistError();

		const currentMatches = await db.Match.findAll({
			where: {
				tournamentId: tournament.id,
				tournament_round: tournament.current_round,
			},
		});

		tournament.currentMatches = currentMatches || [];

		return tournament;
	},

	register: async (tournamentId, userId) => {
		const userTournament = await canRegister(tournamentId, userId);
		await userTournament.tournament.addParticipant(userTournament.user);
		return `${userTournament.tournament.name} successfully registered ${userTournament.user.pseudo}`;
	},

	unsubscribe: async (tournamentId, userId) => {
		const tournamentRegistered = await db.Tournament.findOne({
			where: { id: tournamentId },
			include: [
				{
					model: db.User,
					as: 'participant',
					where: { id: userId },
				},
			],
		});
		if (!tournamentRegistered) {
			throw new UserNotRegisteredError();
		}
		if (tournamentRegistered.status !== 'pending') {
			throw new TournamentAlreadyStartedError();
		} else {
			await db.sequelize.models.Users_Tournaments.destroy({
				where: {
					userId: userId,
					tournamentId: tournamentId,
				},
			});
		}
	},
	start: async (tournamentId) => {
		const tournament = await db.Tournament.findOne({
			where: { id: tournamentId },
			include: [
				{
					model: db.User,
					as: 'participant',
				},
			],
		});

		if (!tournament) throw new TournamentIdNotFoundError();
		if (tournament.status === 'finished') throw new TournamentIsOverError();
		if (tournament.status !== 'pending' || tournament.current_round != 0) throw new TournamentAlreadyStartedError();

		const countParticipants = await tournament.participant.length;
		const endDate = dayjs(await tournament.end_inscription_date);
		const today = dayjs();

		if (tournament.min_player > countParticipants) throw new TournamentMinPlayerNotReachError();
		if (endDate >= today) throw new TournamentRegistrationNotClosed();
		tournament.status = 'inProgress';
		tournament.current_round += 1;
		tournament.save();
		try {
			await createMatches.roundRobin(tournament);
		} catch (error) {
			tournament.current_round -= 1;
			tournament.save();
			throw new Error(error);
		}
		return tournament;
	},
	updateMatch: async (matchId, data) => {
		const match = await db.Match.findByPk(matchId);
		console.log(data);
		if (data.isNull == 'undefined' || !data.winner || !data.status) throw new MatchInfoMissingError();
		const tournament = await db.Tournament.findByPk(match.tournamentId);
		if (match.tournament_round != tournament.current_round) throw new MatchNotGoodRoundError();
		match.isNull = data.isNull;
		match.winner = data.winner;
		match.status = data.status;
		match.save();
		return match;
	},
};

export default tournamentService;

// const matches = tournament.matches;
// matches?.forEach((match) => {
// 	if (match.status !== 'finished') throw new AllMatchesAreNotOverError();
// });

// await tournament.save();
