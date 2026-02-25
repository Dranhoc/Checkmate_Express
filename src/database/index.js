import sequelize from './config.js';

import Category from './entities/category.entity.js';
import Match from './entities/match.entity.js';
import Tournament from './entities/tournament.entity.js';
import User from './entities/user.entity.js';

// User can participate multiple tournament
User.belongsToMany(Tournament, {
	through: 'Users_Tournaments',
	foreignKey: 'userId',
	otherKey: 'tournamentId',
	as: 'tournaments',
});

// Tournament can have multiple users
Tournament.belongsToMany(User, {
	through: 'Users_Tournaments',
	foreignKey: 'tournamentId',
	otherKey: 'userId',
	as: 'participant',
});

//A match belongs to a Tournament
Match.belongsTo(Tournament, {
	as: 'match',
	foreignKey: 'tournamentId',
});

//Tournament have one more categories
Tournament.belongsToMany(Category, {
	through: 'Tournament_Categories',
	foreignKey: 'tournamentId',
	otherKey: 'categoryName',
	as: 'category',
});

//Categories have many tournaments
Category.belongsToMany(Tournament, {
	through: 'Tournament_Categories',
	foreignKey: 'categoryName',
	otherKey: 'tournamentId',
	as: 'tournaments_category',
});

// A user can play multiple vanilla matches
User.hasMany(Match, {
	as: 'whitePlaying',
	foreignKey: {
		name: 'white_userId',
		allowNull: false,
	},
});
// A user can play multiple chocolate matches
User.hasMany(Match, {
	as: 'blackPlaying',
	foreignKey: {
		name: 'black_userId',
		allowNull: false,
	},
});

export default {
	User,
	Category,
	Match,
	Tournament,
	sequelize,
};
