import { ConcertListingDTO } from '../dtos/concert.dto.js';
import concertService from '../services/concert.service.js';

const concertController = {
	create: async (req, res) => {
		const concert = await concertService.create(req.data, req.user.id);
		const dto = new ConcertListingDTO(concert);
		res.status(201).json({ data: dto });
	},
	getAll: async (req, res) => {
		const { name, fromPrice, toPrice, fromDate, orderByName, orderByDate, orderByPrice, offset, limit } = req.validatedQuery;

		const filter = { name, fromPrice, toPrice, fromDate };
		const pagination = {
			orders: {
				price: orderByPrice,
				date: orderByDate,
				name: orderByName,
			},
			limit,
			offset,
		};
		const concerts = await concertService.getAll(filter, pagination);
		const dtos = concerts.map((c) => new ConcertListingDTO(c));

		res.status(200).json({ data: dtos });
	},

	delete: async (req, res) => {
		await concertService.delete(req.params.id, req.user);

		res.status(204).send();
	},
};

export default concertController;
