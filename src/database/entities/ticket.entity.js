import { DataTypes } from 'sequelize';
import sequelize from '../config.js';

const Ticket = sequelize.define(
	'Ticket',
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		isVIP: {
			type: DataTypes.BOOLEAN,
			defaultValue: false,
		},
		fullname: {
			type: DataTypes.STRING,
			allowNull: false,
		},
	},
	{
		tableName: 'tickets',
		paranoid: true,
	},
);

export default Ticket;
