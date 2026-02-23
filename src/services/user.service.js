import dayjs from 'dayjs';
import db from '../database/index.js';
import bcrypt from 'bcrypt';
import { EmailAlreadyExistsError, InvalidCredentialsError, PseudoAlreadyExistsError } from '../custom-errors/user.error.js';
const { ENCRYPTION_ROUND } = process.env;

const userService = {
	create: async (data) => {
		const existingEmail = await db.User.findOne({
			where: {
				email: data.email,
			},
		});
		if (existingEmail) {
			throw new EmailAlreadyExistsError();
		}
		const existingPseudo = await db.User.findOne({
			where: {
				pseudo: data.pseudo,
			},
		});
		if (existingPseudo) {
			throw new PseudoAlreadyExistsError();
		}

		data.password = bcrypt.hashSync(data.password, +ENCRYPTION_ROUND);
		const newUser = await db.User.create(data);
		return newUser;
	},
	login: async (credentials) => {
		const existingEmail = await db.User.findOne({
			where: {
				email: credentials.email,
			},
		});
		if (!existingEmail) {
			throw new InvalidCredentialsError();
		}
		const checkPassword = bcrypt.compareSync(credentials.password, existingEmail.password);
		if (!checkPassword) {
			throw new InvalidCredentialsError();
		}
		return existingEmail;
	},
	getAll: async () => {
		return await db.User.findAll();
	},
};

export default userService;
