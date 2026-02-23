export const bodyValidator = (dataValidator) => {
	return (req, res, next) => {
		const { data, success, error } = dataValidator.safeParse(req.body);
		console.log(`   --🚨 ${{ data, success, error }} 🚨--`);
		if (!success) {
			//Le formulaire reçu n'est pas valide
			//TODO gérer les error
			const { fieldErrors } = error.flatten();
			res.status(400).json({ errors: fieldErrors });
		} else {
			//Le formulaire reçu est valide
			req.data = data;
			next();
		}
	};
};

export const queryValidator = (dataValidator) => {
	return (req, res, next) => {
		const { data, success, error } = dataValidator.safeParse(req.query);
		req.validatedQuery = data;
		console.log(`   --🚨 ${data} 🚨--`);
		next();
	};
};
