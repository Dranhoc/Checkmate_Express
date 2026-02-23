import userService from '../services/user.service.js';
import { generateToken } from '../utils/jwt.utils.js';
import { sendMail } from '../services/mailer.service.js';

const authController = {
	register: async (req, res) => {
		const newUser = await userService.create(req.data);
		await sendMail(newUser.email, 'Welcome!', '<h1>HH!</h1>');
		res.status(204).send();
	},
	login: async (req, res) => {
		const user = await userService.login(req.data);

		// générer un JWT
		const token = generateToken(user);
		// donner le JWT au client
		res.status(200).json({ token });
	},
};

export default authController;
