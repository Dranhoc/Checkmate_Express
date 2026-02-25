import z from 'zod';

export const createTournamentValidator = z.object({
	id: z.number().optional(),
	name: z.string().min(2).max(255),
	location: z.string().optional(),
	min_player: z.number().min(2),
	max_player: z.number().max(32),
	min_elo: z.number().min(0).optional(),
	max_elo: z.number().max(3000).optional(),
	current_round: z.number().optional(),
	woman_only: z.boolean(),
	status: z.enum(['waiting', 'pending', 'finished']).catch('finished'),
	end_inscription_date: z.iso.datetime(),
	current_round: z.number().min(0),
	categories: z.array(z.string()).optional().default([]),
});

export const getAllTournamentQueryValidator = z.object({
	name: z.string().optional().catch(null),
	status: z.enum(['waiting', 'pending', 'finished']).optional().catch(null),
	category: z.enum(['Junior', 'Veteran', 'Senior', 'AllAges']).optional().catch(null),
	elo: z.coerce.number().min(0).max(3000).optional().catch(null),
	fromElo: z.coerce.number().min(0).max(3000).optional().catch(null),
	toElo: z.coerce.number().min(0).max(3000).optional().catch(null),
	fromDate: z.iso.date().optional().catch(null),
	toDate: z.iso.date().optional().catch(null),
	orderByUpdateDate: z.enum(['asc', 'desc']).default('desc'),
	canRegister: z.boolean().optional().catch(null),
	isRegistered: z.boolean().optional().catch(null),
	offset: z.coerce.number().min(0).default(0),
	limit: z.coerce.number().min(1).max(100).default(10),
});
