export class TournamentListingDTO {
	constructor(tournament) {
		this.id = tournament.id;
		this.name = tournament.name;
		this.location = tournament.location;
		this.min_player = tournament.min_player;
		this.max_player = tournament.max_player;
		this.min_elo = tournament.min_elo;
		this.max_elo = tournament.max_elo;
		this.current_round = tournament.current_round;
		this.woman_only = tournament.woman_only;
		this.end_inscription_date = tournament.end_inscription_date;
		this.status = tournament.status;

		this.category = tournament.category.map((cat) => ({
			name: cat.name,
			age_min: cat.age_min,
			age_max: cat.age_max,
		}));
		!this.category.length ? (this.category = 'No category') : '';

		this.participantsCount = tournament.participant.length;
		this.participant = tournament.participant.map((user) => ({
			id: user.id,
			pseudo: user.pseudo,
			elo: user.elo,
			gender: user.gender,
			birthDate: user.birthDate,
		}));
		!this.participant.length ? (this.participant = 'No participant') : '';

		this.currentMatches =
			tournament.currentMatches && tournament.currentMatches.length > 0 ?
				tournament.currentMatches.map((match) => ({
					id: match.id,
					isNull: match.isNull,
					winner: match.winner,
					round: match.tournament_round,
					status: match.status,
					white_userId: match.white_userId,
					black_userId: match.black_userId,
					createdAt: match.createdAt,
					updatedAt: match.updatedAt,
				}))
			:	'No match';
	}
}
