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
export class NoPseudoOrEmailProvidedError extends Error {
	statusCode = 400;

	constructor() {
		super('No email or pseudo provided');
	}
}
export class UserNotExistError extends Error {
	statusCode = 400;

	constructor() {
		super('User not exists or not connected');
	}
}
