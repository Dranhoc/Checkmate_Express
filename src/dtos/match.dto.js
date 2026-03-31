export class MatchDTO {
	constructor(match) {
		this.id = match.id;
		this.tournamentId = match.tournamentId;
		this.white_userId = match.white_userId;
		this.black_userId = match.black_userId;
		this.isNull = match.isNull;
		this.winner = match.winner;
		this.tournament_round = match.tournament_round;
		this.status = match.status;
		this.whitePlaying = {
			id: match.whitePlaying.id,
			pseudo: match.whitePlaying.pseudo,
			elo: match.whitePlaying.elo,
		};
		this.blackPlaying = {
			id: match.blackPlaying.id,
			pseudo: match.blackPlaying.pseudo,
			elo: match.blackPlaying.elo,
		};
	}
}
