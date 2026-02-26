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
		super('Tournament already started');
	}
}
export class TournamentNotExistError extends Error {
	statusCode = 400;

	constructor() {
		super('Tournament not exists');
	}
}
export class TournamentIsFullError extends Error {
	statusCode = 400;

	constructor() {
		super('Tournament is full');
	}
}
export class TournamentEloError extends Error {
	statusCode = 400;

	constructor() {
		super('Your ELO is too high or too low for this tournament');
	}
}
export class TournamentAgeNotCorrespondingError extends Error {
	statusCode = 400;

	constructor() {
		super("Your age is not corresponding to the tournament's categories");
	}
}
export class TournamentEndOfRegistrationError extends Error {
	statusCode = 400;

	constructor() {
		super('The registrations has expired');
	}
}
export class TournamentNotForMalesError extends Error {
	statusCode = 400;

	constructor() {
		super('This tournament is women only');
	}
}
export class AlreadyRegisteredError extends Error {
	statusCode = 400;

	constructor() {
		super('You are already registered to this tournament');
	}
}
export class UserNotRegisteredError extends Error {
	statusCode = 400;

	constructor() {
		super('You are not registered to this tournament');
	}
}
