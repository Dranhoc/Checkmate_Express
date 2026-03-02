export class AllMatchesAreNotOverError extends Error {
	statusCode = 400;

	constructor() {
		super('All the matches are not over');
	}
}
