export class DateInThePastError extends Error {
	statusCode = 400;

	constructor() {
		super('The date cannot be in the past');
	}
}

export class OrganizerNotExists extends Error {
	statusCode = 400;

	constructor(id) {
		super(`The organizer with the ID ${id} doesnt exist.`);
	}
}
export class DontOrganizeConcertError extends Error {
	statusCode = 403;

	constructor() {
		super(`You don't have the right to delete this concert`);
	}
}
