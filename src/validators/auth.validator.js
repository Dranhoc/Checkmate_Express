import z from 'zod';

export const registerValidator = z.object({
	email: z.email('email must be a valid email'),
	password: z.string().min(8).max(64),
	birthDate: z.iso.date(),
});

export const loginValidator = z.object({
	email: z.email('email must be a valid email'),
	password: z.string().min(8).max(64),
});
