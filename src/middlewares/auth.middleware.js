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
				role: decoded.role,
			};
		} catch (error) {
			console.log(error);

			res.status(401).send();
			return;
		}
	}
	next();
};

// Function restriction pour arriver à la route (ex : "est-ce que le user est admin ?")

export const connected = (onlyForRoles) => {
	return (req, res, next) => {
		if (!req.user) {
			res.status(401).send();
			return;
		}
		//si on a des roles qui sont précisés, on check le role
		if (onlyForRoles) {
			//récupérer le role du user
			const userRole = req.user.role;
			//vérifier si le role du role fait partie du tableau
			if (!onlyForRoles.includes(userRole)) {
				res.status(403).send();
				return;
			}
		}
		next();
	};
};
