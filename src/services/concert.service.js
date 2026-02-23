import dayjs from 'dayjs';
import { DateInThePastError, DontOrganizeConcertError, OrganizerNotExists } from '../custom-errors/concert.error.js';
import db from '../database/index.js';
import { Op } from 'sequelize';

const concertService = {
	create: async (data, organizerId) => {
		const date = dayjs(data.date);
		if (date < dayjs()) {
			throw new DateInThePastError();
		}

		const organizer = await db.User.findByPk(organizerId);
		if (!organizer) {
			throw new OrganizerNotExists(organizerId);
		}

		const newConcertData = {
			...data,
			organizerId,
		};

		const concert = await db.Concert.create(newConcertData);
		return concert;
	},
	getAll: async (filter, pagination) => {
		const where = {};
		if (filter) {
			if (filter.name) {
				where.name = {
					[Op.iLike]: `%${filter.name}%`,
				};
			}
			if (filter.fromPrice && filter.toPrice) {
				where.price = {
					[Op.between]: [filter.fromPrice, filter.toPrice],
				};
			}
			if (filter.fromDate && filter.toDate) {
				where.date = {
					[Op.gte]: filter.fromDate,
				};
			}
		}
		const order = [];
		if (pagination.orders) {
			if (pagination.orders.price) {
				order.push(['price', pagination.orders.price]);
			}
			if (pagination.orders.date) {
				order.push(['date', pagination.orders.date]);
			}
			if (pagination.orders.name) {
				order.push(['name', pagination.orders.name]);
			}
		}
		const concerts = await db.Concert.findAll({
			where,
			offset: pagination.offset,
			limit: pagination.limit,
			order,
		});
		return concerts;
	},
	delete: async (id, requester) => {
		const concert = await db.Concert.findByPk(id);
		if (requester.role !== 'admin') {
			if (concert.organizerId !== requester.id) {
				throw new DontOrganizeConcertError();
			}
		}
		await concert?.destroy();
	},
};

export default concertService;
