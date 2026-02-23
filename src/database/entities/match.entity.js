import { DataTypes } from 'sequelize';
import sequelize from '../config.js';

const Match = sequelize.define(
	'Match',
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		isNull: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false,
		},
		winner: {
			type: DataTypes.UUID,
			allowNull: true,
		},
		status: {
			type: DataTypes.ENUM('pending', 'waiting', 'finished'),
			allowNull: false,
		},
	},
	{
		tableName: 'matches',
		paranoid: true,
	},
);

export default Match;
