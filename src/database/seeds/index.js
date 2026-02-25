import 'dotenv/config';
import db from '../index.js';
import { tournamentData } from './tournament.seed.js';
import { categoryData } from './category.seed.js';
import { userData } from './user.seed.js';

async function runSeed() {
	try {
		await db.sequelize.authenticate();
		console.log(`   --🚨 Supabase connexion established 🚨--`);
		await db.sequelize.sync({ force: true });

		await db.Tournament.bulkCreate(tournamentData);
		await db.Category.bulkCreate(categoryData);
		await db.User.bulkCreate(userData);

		console.log(`   --👉 The seeds are all planted 👈--`);
	} catch (error) {
		console.log(`   --🏴‍☠️ ${error} 🏴‍☠️--`);
	} finally {
		await db.sequelize.close();
		process.exit();
	}
}

runSeed();
