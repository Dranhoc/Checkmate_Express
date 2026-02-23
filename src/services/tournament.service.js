import dayjs from 'dayjs';
import { DateNotFarEnoughError, MinELOOfPlayersError, MinNumberOfPlayersError } from '../custom-errors/tournament.error.js';
import db from '../database/index.js';
import { Op } from 'sequelize';

const tournamentService = {
	create: async (data) => {
		const endDate = dayjs(data.end_inscription_date);
		const minPlayer = data.min_player;
		const maxPlayer = data.max_player;
		const minElo = data.minElo;
		const maxElo = data.maxElo;

		const minEndDate = endDate.add(minPlayer, 'day');
		if (endDate < minEndDate) {
			throw new DateNotFarEnoughError();
		}

		if (minPlayer > maxPlayer) {
			throw new MinNumberOfPlayersError();
		}

		if (minElo > maxElo) {
			throw new MinELOOfPlayersError();
		}

		const tournament = await db.Tournament.create(data);
		return tournament;
	},

	getAll: async () => {
		return await db.Tournament.findAll();
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
