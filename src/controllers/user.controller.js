import { UserDetailsDTO, UserListingDTO } from '../dtos/user.dto.js';
import userService from '../services/user.service.js';

const userController = {
	getAll: async (req, res) => {
		const users = await userService.getAll();

		const usersDTO = users.map((user) => new UserListingDTO(user));
		res.status(200).json({ data: usersDTO });
	},
	getAllDetails: async (req, res) => {
		const users = await userService.getAll();

		const usersDTO = users.map((user) => new UserDetailsDTO(user));
		res.status(200).json({ data: usersDTO });
	},
};

export default userController;
