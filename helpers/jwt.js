const jwt = require('jsonwebtoken');

const generarJWT = (uid) => {
	return new Promise((resolve, reject) => {
		const payload = { uid };
		jwt.sign(
			payload,
			process.env.JWT_KEY,
			{
				expiresIn: '24h',
			},
			(error, token) => {
				if (error) {
					// No se pudo crear el token
                    reject('No se pudo generar el JWT');
				} else {
					// Se pudo crear el token
                    resolve(token);
				}
			}
		);
	});
};

module.exports = {
	generarJWT,
};
