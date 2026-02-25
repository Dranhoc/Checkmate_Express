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

	getAll: async () => {
		return await db.Tournament.findAll({
			include: [
				{
					model: db.Category,
					as: 'category',
				},
			],
		});
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
	// getAll: async (filter, pagination) => {
	// 	const where = {};
	// 	if (filter) {
	// 		if (filter.name) {
	// 			where.name = {
	// 				[Op.iLike]: `%${filter.name}%`,
	// 			};
	// 		}
	// 		if (filter.fromPrice && filter.toPrice) {
	// 			where.price = {
	// 				[Op.between]: [filter.fromPrice, filter.toPrice],
	// 			};
	// 		}
	// 		if (filter.fromDate && filter.toDate) {
	// 			where.date = {
	// 				[Op.gte]: filter.fromDate,
	// 			};
	// 		}
	// 	}
	// 	const order = [];
	// 	if (pagination.orders) {
	// 		if (pagination.orders.price) {
	// 			order.push(['price', pagination.orders.price]);
	// 		}
	// 		if (pagination.orders.date) {
	// 			order.push(['date', pagination.orders.date]);
	// 		}
	// 		if (pagination.orders.name) {
	// 			order.push(['name', pagination.orders.name]);
	// 		}
	// 	}
	// 	const concerts = await db.Concert.findAll({
	// 		where,
	// 		offset: pagination.offset,
	// 		limit: pagination.limit,
	// 		order,
	// 	});
	// 	return concerts;
	// },
	// delete: async (id, requester) => {
	// 	const concert = await db.Concert.findByPk(id);
	// 	if (requester.role !== 'admin') {
	// 		if (concert.organizerId !== requester.id) {
	// 			throw new DontOrganizeConcertError();
	// 		}
	// 	}
	// 	await concert?.destroy();
	// },
};

export default tournamentService;
