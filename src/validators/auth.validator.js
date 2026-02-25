import z from 'zod';

export const registerValidator = z.object({
	email: z.email('email must be a valid email'),
	pseudo: z.string().min(2).max(64),
	password: z.string().min(8).max(64),
	birthDate: z.iso.date(),
	gender: z.enum(['male', 'female', 'other']),
	elo: z.number().min(0).max(3000).optional(),
});

export const loginValidator = z.object({
	email: z.email('email must be a valid email').optional(),
	pseudo: z.string().min(2).max(64).optional(),
	password: z.string().min(8).max(64),
});
