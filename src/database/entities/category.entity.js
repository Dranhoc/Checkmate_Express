import { DataTypes } from 'sequelize';
import sequelize from '../config.js';

const Category = sequelize.define(
	'Category',
	{
		name: {
			type: DataTypes.STRING,
			primaryKey: true,
			unique: true,
		},
		age_min: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 0,
		},
		age_max: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 135,
		},
	},
	{
		tableName: 'category',
	},
);

export default Category;
