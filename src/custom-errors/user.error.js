export class EmailAlreadyExistsError extends Error {
	statusCode = 400;

	constructor() {
		super('Email already exists');
	}
}
export class PseudoAlreadyExistsError extends Error {
	statusCode = 400;

	constructor() {
		super('Pseudo already exists');
	}
}

export class InvalidCredentialsError extends Error {
	statusCode = 400;

	constructor() {
		super('Invalid credentials');
	}
}
