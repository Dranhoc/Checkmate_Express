import dayjs from 'dayjs';
import {
	DateNotFarEnoughError,
	MinELOOfPlayersError,
	MinNumberOfPlayersError,
	TournamentAlreadyStartedError,
	TournamentIdNotFoundError,
	TournamentNotExistError,
} from '../custom-errors/tournament.error.js';
import db from '../database/index.js';
import { Op } from 'sequelize';
import { CategoryNotFoundError } from '../custom-errors/category.error.js';
import { UserNotExistError } from '../custom-errors/user.error.js';
import { canRegister } from '../utils/tournamentRegister.utils.js';

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
};

export default tournamentService;
