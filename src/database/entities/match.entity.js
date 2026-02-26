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
		tournament_round: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		status: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				isIn: [['pending', 'inProgress', 'finished']],
			},
		},
	},
	{
		tableName: 'matches',
		paranoid: true,
	},
);

export default Match;
