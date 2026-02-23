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
			unique: true,
		},
		pseudo: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		birthDate: {
			type: DataTypes.DATE,
			allowNull: false,
		},
		gender: {
			type: DataTypes.ENUM('male', 'female', 'other'),
			allowNull: false,
		},
		isAdmin: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false,
		},
		elo: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 1200,
		},
	},
	{
		tableName: 'users',
		paranoid: true,
	},
);

export default User;
