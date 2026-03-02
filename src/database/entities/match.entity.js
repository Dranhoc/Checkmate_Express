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
		tournamentId: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		white_userId: {
			type: DataTypes.UUID,
			allowNull: false,
		},
		black_userId: {
			type: DataTypes.UUID,
			allowNull: false,
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
			defaultValue: 'pending',
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
