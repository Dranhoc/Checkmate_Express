import z from 'zod';

export const createTournamentValidator = z.object({
	name: z.string().min(2).max(255),
	location: z.string().optional(),
	playerMin: z.number().min(2),
	playerMax: z.number().max(32),
	eloMin: z.number().min(0).optional(),
	eloMax: z.number().max(3000).optional(),
	endDate: z.iso.datetime(),
	currentRound: z.number().min(0),
	isWomanOnly: z.boolean(),
});

// export const getAllTournamentQueryValidator = z.object({
// 	name: z.string().optional().catch(null),
// 	fromPrice: z.number().optional().catch(null),
// 	toPrice: z.number().optional().catch(null),
// 	fromDate: z.iso.date().optional().catch(null),
// 	orderByName: z.enum(['asc', 'desc']).optional().catch('desc'),
// 	orderByDate: z.enum(['asc', 'desc']).optional().catch('desc'),
// 	orderByPrice: z.enum(['asc', 'desc']).optional().catch('desc'),
// 	offset: z.coerce.number().min(0).default(0),
// 	limit: z.coerce.number().min(1).max(100).default(20),
// });
