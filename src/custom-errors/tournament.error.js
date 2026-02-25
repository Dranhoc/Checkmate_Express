export class DateNotFarEnoughError extends Error {
	statusCode = 400;

	constructor() {
		super('The date must be [number of min player] days in the future');
	}
}
export class MinNumberOfPlayersError extends Error {
	statusCode = 400;

	constructor() {
		super('The minimum number of players must be below or equal to the maximum of players');
	}
}
export class MinELOOfPlayersError extends Error {
	statusCode = 400;

	constructor() {
		super('The minimum ELO must be below or equal to the maximum');
	}
}
export class TournamentIdNotFoundError extends Error {
	statusCode = 400;

	constructor() {
		super('Tournament ID not found');
	}
}
export class TournamentAlreadyStartedError extends Error {
	statusCode = 400;

	constructor() {
		super("Tournament already started, you can't delete it");
	}
}
