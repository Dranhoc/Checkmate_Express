export class CategoryNotFoundError extends Error {
	statusCode = 400;

	constructor() {
		super("The category does'nt exist");
	}
}
