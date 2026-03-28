import 'console-separator';
import 'dotenv/config';
import db from '../index.js';
import { tournamentData } from './tournament.seed.js';
import { categoryData } from './category.seed.js';
import { userData } from './user.seed.js';
import { tournamentCategoriesData } from './tournamentCategories.seed.js';
import { Op } from 'sequelize';

async function runSeed() {
	try {
		await db.sequelize.authenticate();
		console.alog(`Supabase connexion established`);
		await db.sequelize.sync({ force: true });

		await db.User.bulkCreate(userData);
		await db.Category.bulkCreate(categoryData);
		await db.Tournament.bulkCreate(tournamentData);
		await db.sequelize.models.Tournament_Categories.bulkCreate(tournamentCategoriesData);

		const allUsersNoCheckMate = await db.User.findAll({
			where: {
				pseudo: {
					[Op.ne]: 'MisterCheckMate',
				},
			},
		});
		const allUsers = await db.User.findAll({});

		const tournamentsUsersData = [];
		for (const e of allUsersNoCheckMate) {
			tournamentsUsersData.push({ userId: e.id, tournamentId: 7 });
		}
		const tournamentsAllUsersData = [];
		for (const e of allUsers) {
			tournamentsAllUsersData.push({ userId: e.id, tournamentId: 2 });
		}
		await db.sequelize.models.Users_Tournaments.bulkCreate(tournamentsUsersData);
		await db.sequelize.models.Users_Tournaments.bulkCreate(tournamentsAllUsersData);

		console.ilog('The seeds are all planted');
	} catch (error) {
		console.elog(error);
	} finally {
		await db.sequelize.close();
		// process.exit();
	}
}

runSeed();
