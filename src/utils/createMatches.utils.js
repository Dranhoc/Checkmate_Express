import db from '../database/index.js';
const createMatches = {
	roundRobin: async (tournament) => {
		if (tournament.participant.length % 2 != 0) {
			const misterCheckMate = await db.User.findOne({
				where: { pseudo: 'MisterCheckMate' },
			});
			tournament.addParticipant(misterCheckMate);
		}
		let participants = tournament.participant.map((participant) => {
			return participant.id;
		});
		const n = participants.length;

		for (let i = 0; i < n - 1; i++) {
			if (i != 0) {
				let lastParticipant = participants.pop();
				participants.splice(1, 0, lastParticipant);
			}
			for (let j = 0; j < n / 2; j++) {
				newMatch(tournament.id, participants[j], participants[n - j - 1], i + 1);
			}
		}
		for (let i = 0; i < n - 1; i++) {
			let lastParticipant = participants.pop();
			participants.splice(1, 0, lastParticipant);
			for (let j = 0; j < n / 2; j++) {
				newMatch(tournament.id, participants[n - j - 1], participants[j], i + 1);
			}
		}
	},
};

async function newMatch(tournamentId, playerWhiteId, playerBlackId, current_round) {
	await db.Match.create({
		tournamentId: tournamentId,
		white_userId: playerWhiteId,
		black_userId: playerBlackId,
		tournament_round: current_round,
	});
}

export default createMatches;
