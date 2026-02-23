import sequelize from './config.js';

import User from './entities/user.entity.js';
import Concert from './entities/concert.entity.js';
import Ticket from './entities/ticket.entity.js';

// Concert is organize by User
Concert.belongsTo(User, {
	as: 'organizer',
	foreignKey: {
		allowNull: false,
		name: 'organizerId',
	},
});
// A User can organize multiple concert
User.hasMany(Concert, {
	as: 'concerts',
	foreignKey: 'organizerId',
});

//A ticket is for a concert
Ticket.belongsTo(Concert, {
	as: 'concert',
	foreignKey: {
		allowNull: false,
		name: 'concertId',
	},
});
// A concert can have multiple tickets
Concert.hasMany(Ticket, {
	as: 'tickets',
	foreignKey: 'concertId',
});
// A ticket is owned by a User
Ticket.belongsTo(User, {
	as: 'owner',
	foreignKey: {
		allowNull: false,
		name: 'ownerId',
	},
});
// A User can have multiple Tickets
User.hasMany(Ticket, {
	foreignKey: 'ownerId',
});

export default {
	User,
	Concert,
	Ticket,
	sequelize,
};
