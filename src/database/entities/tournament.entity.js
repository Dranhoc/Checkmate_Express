import { DataTypes } from 'sequelize';
import sequelize from '../config.js';

const Tournament = sequelize.define(
	'Tournament',
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		location: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		min_player: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 2,
		},
		max_player: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 32,
		},
		min_elo: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 0,
		},
		max_elo: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 3000,
		},
		current_round: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 0,
		},
		woman_only: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false,
		},
		end_inscription_date: {
			type: DataTypes.DATE,
			allowNull: true,
		},
		status: {
			type: DataTypes.ENUM('pending', 'waiting', 'finished'),
			allowNull: false,
			defaultValue: 'waiting',
		},
	},
	{
		tableName: 'tournament',
		paranoid: true,
	},
);

export default Tournament;
