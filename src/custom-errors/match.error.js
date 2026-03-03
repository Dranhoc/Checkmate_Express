export class AllMatchesAreNotOverError extends Error {
	statusCode = 400;

	constructor() {
		super('All the matches are not over');
	}
}
export class MatchInfoMissingError extends Error {
	statusCode = 400;

	constructor() {
		super('isNull(boolean), winner(userUUID) and status(finished) are required');
	}
}
export class MatchNotGoodRoundError extends Error {
	statusCode = 400;

	constructor() {
		super('Match round is different than Tournament current round');
	}
}
