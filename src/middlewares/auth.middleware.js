import { decodeToken } from '../utils/jwt.utils.js';

// Function d'auth (récup du token et le décodage)
export const authentification = (req, res, next) => {
	const bearerToken = req.headers['authorization'];

	if (bearerToken) {
		//extraction du token
		const [bearer, token] = bearerToken.split(' ');
		if (bearer.toLowerCase() !== 'bearer') {
			res.status(403).send();
			return;
		}
		//decodage
		try {
			const decoded = decodeToken(token);
			//sauvegarde dans l'objet req
			req.user = {
				id: decoded.id,
				isAdmin: decoded.isAdmin,
			};
		} catch (error) {
			console.log(error);

			res.status(401).send();
			return;
		}
	}
	next();
};

export const connected = (onlyAdmin) => {
	return (req, res, next) => {
		if (!req.user) {
			return res.status(401).send();
		}

		if (onlyAdmin) {
			if (req.user.isAdmin !== true) {
				return res.status(403).send();
			}
		}

		next();
	};
};
