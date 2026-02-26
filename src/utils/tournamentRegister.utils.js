import dayjs from 'dayjs';
import {
	AlreadyRegisteredError,
	TournamentAgeNotCorrespondingError,
	TournamentAlreadyStartedError,
	TournamentEloError,
	TournamentEndOfRegistrationError,
	TournamentIsFullError,
	TournamentNotExistError,
	TournamentNotForMalesError,
} from '../custom-errors/tournament.error.js';
import db from '../database/index.js';
import { UserNotExistError } from '../custom-errors/user.error.js';

export const canRegister = async (tournamentId, userId) => {
	const user = await db.User.findByPk(userId);
	if (!user) throw new UserNotExistError();

	const tournament = await db.Tournament.findOne({
		where: { id: tournamentId },
		include: [{ model: db.Category, as: 'category' }],
	});
	if (!tournament) throw new TournamentNotExistError();

	const count = await tournament.countParticipant();
	const alreadyRegistered = await db.sequelize.models.Users_Tournaments.findOne({
		where: { tournamentId, userId },
	});

	const userAge = dayjs().diff(dayjs(user.birthDate), 'year');
	const tournamentStarted = tournament.status !== 'pending' || tournament.current_round > 0;

	const currentDate = dayjs();
	const endDate = dayjs(tournament.end_inscription_date);

	const isAgeValid = tournament.category.some((cat) => userAge >= cat.age_min && userAge <= cat.age_max);

	if (alreadyRegistered) throw new AlreadyRegisteredError();
	if (currentDate > endDate) throw new TournamentEndOfRegistrationError();
	if (count >= tournament.max_player) throw new TournamentIsFullError();
	if (tournamentStarted) throw new TournamentAlreadyStartedError();
	if (tournament.woman_only && user.gender === 'male') throw new TournamentNotForMalesError();
	if (!isAgeValid) throw new TournamentAgeNotCorrespondingError();
	if (user.elo < tournament.min_elo || user.elo > tournament.max_elo) throw new TournamentEloError();

	return { user, tournament };
};
