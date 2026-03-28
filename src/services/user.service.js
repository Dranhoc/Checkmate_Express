import dayjs from 'dayjs';
import db from '../database/index.js';
import bcrypt from 'bcrypt';
import { EmailAlreadyExistsError, InvalidCredentialsError, NoPseudoOrEmailProvidedError, PseudoAlreadyExistsError } from '../custom-errors/user.error.js';
const { ENCRYPTION_ROUND } = process.env;

const userService = {
	create: async (data) => {
		if (data.email) {
			const existingEmail = await db.User.findOne({
				where: {
					email: data.email,
				},
			});
			if (existingEmail) {
				throw new EmailAlreadyExistsError();
			}
		}
		if (data.pseudo) {
			const existingPseudo = await db.User.findOne({
				where: {
					pseudo: data.pseudo,
				},
			});
			if (existingPseudo) {
				throw new PseudoAlreadyExistsError();
			}
		}
		if (data.password) {
			data.password = bcrypt.hashSync(data.password, +ENCRYPTION_ROUND);
		}
		const newUser = await db.User.create(data);
		return newUser;
	},
	login: async (credentials) => {
		if (credentials.email) {
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
		}

		if (credentials.pseudo) {
			const existingPseudo = await db.User.findOne({
				where: {
					pseudo: credentials.pseudo,
				},
			});
			if (!existingPseudo) {
				throw new InvalidCredentialsError();
			}
			const checkPassword = bcrypt.compareSync(credentials.password, existingPseudo.password);
			if (!checkPassword) {
				throw new InvalidCredentialsError();
			}
			return existingPseudo;
		}
		s;
		if (!credentials.pseudo && !credentials.email) {
			throw new NoPseudoOrEmailProvidedError();
		}
	},
	getAll: async () => {
		return await db.User.findAll();
	},
	getById: async (userId) => {
		return await db.User.findByPk(userId);
	},
};

export default userService;
