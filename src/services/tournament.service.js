import dayjs from 'dayjs';
import {
	AlreadyRegisteredError,
	DateNotFarEnoughError,
	MinELOOfPlayersError,
	MinNumberOfPlayersError,
	TournamentAgeNotCorrespondingError,
	TournamentAlreadyStartedError,
	TournamentEloError,
	TournamentEndOfRegistrationError,
	TournamentIdNotFoundError,
	TournamentIsFullError,
	TournamentNotExistError,
	TournamentNotForMalesError,
} from '../custom-errors/tournament.error.js';
import db from '../database/index.js';
import { Op } from 'sequelize';
import { CategoryNotFoundError } from '../custom-errors/category.error.js';
import { UserNotExistError } from '../custom-errors/user.error.js';

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

	getAll: async (filter, pagination) => {
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
				categoryWhere.categoryName = filter.category;
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
		const user = await db.User.findByPk(userId);
		const tournament = await db.Tournament.findOne({
			where: { id: tournamentId },
			include: [
				{
					model: db.Category,
					as: 'category',
				},
			],
		});

		const count = await tournament.countParticipant();
		const alreadyRegistered = await db.sequelize.models.Users_Tournaments.findOne({
			where: {
				tournamentId: tournamentId,
				userId: userId,
			},
		});

		if (!user) throw new UserNotExistError();
		if (!tournament) throw new TournamentNotExistError();

		const userAge = dayjs().diff(dayjs(user.birthDate), 'year');
		const tournamentStarted = tournament.status != 'pending' || tournament.current_round > 0;
		const currentDate = dayjs();
		const endDate = dayjs(tournament.end_inscription_date);

		const isAgeValid = tournament.category.some((cat) => {
			return userAge >= cat.age_min && userAge <= cat.age_max;
		});

		if (alreadyRegistered) throw new AlreadyRegisteredError();
		if (currentDate > endDate) throw new TournamentEndOfRegistrationError();
		if (count >= tournament.max_player) throw new TournamentIsFullError();
		if (tournamentStarted) throw new TournamentAlreadyStartedError();
		if (tournament.woman_only && user.gender == 'male') throw new TournamentNotForMalesError();
		if (!isAgeValid) throw new TournamentAgeNotCorrespondingError();
		if (user.elo < tournament.min_elo || user.elo > tournament.max_elo) throw new TournamentEloError();

		await tournament.addParticipant(user);
		return `${tournament.name} successfully registered ${user.pseudo}`;
	},
};

export default tournamentService;
