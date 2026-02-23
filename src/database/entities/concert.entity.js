import { DataTypes } from 'sequelize';
import sequelize from '../config.js';

const Concert = sequelize.define(
	'Concert',
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		date: {
			type: DataTypes.DATE,
			allowNull: false,
		},
		visible: {
			type: DataTypes.BOOLEAN,
			defaultValue: false,
		},
		price: {
			type: DataTypes.DOUBLE,
			allowNull: true,
		},
	},
	{
		tableName: 'concerts',
		paranoid: true,
	},
);

export default Concert;
