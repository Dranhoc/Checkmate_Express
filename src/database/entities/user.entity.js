import { DataTypes } from 'sequelize';
import sequelize from '../config.js';

const User = sequelize.define(
	'User',
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
		},
		email: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		birthDate: {
			type: DataTypes.DATE,
			allowNull: true,
		},
		role: {
			type: DataTypes.STRING,
			allowNull: true,
		},
	},
	{
		tableName: 'users',
	},
);

export default User;
