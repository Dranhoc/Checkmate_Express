export const errorHandler = (err, req, res, next) => {
	console.log(err);

	// récupérer le status dans l'erreur (si on en a un)
	const statusCode = err.statusCode || 500;

	const message = statusCode === 500 ? 'Internal server error' : err.message;

	res.status(statusCode).json({ message });
};
