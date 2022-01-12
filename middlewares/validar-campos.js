const { request, response } = require('express');
const { validationResult } = require('express-validator');

const Usuario = require('../models/usuario');

const validarCampos = (req = request, res = response, next) => {
	const errores = validationResult(req);
	if (!errores.isEmpty()) {
		return res.status(400).json({
			ok: false,
			errores: errores.mapped(),
		});
	}
	next();
};

const userExistsByEmail = (email) => {
	return Usuario.findOne({ email }).then((user) => {
		if (user) {
			return Promise.reject('El email ya está en uso');
		}
	});
};

module.exports = {
	validarCampos,
	userExistsByEmail,
};
