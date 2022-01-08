const { request, response } = require('express');
const bcrypt = require('bcryptjs');

const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');

const crearUsuario = async (req = request, res = response) => {
	const usuario = new Usuario(req.body);

	// Encriptar contraseña
	const salt = bcrypt.genSaltSync();
	const { password } = req.body;
	usuario.password = bcrypt.hashSync(password, salt);

	await usuario.save();

	// Generar JWT
	const token = await generarJWT(usuario.id);

	res.json({
		ok: true,
		usuario,
		token,
	});
};

const login = async (req = request, res = response) => {
	const { email, password } = req.body;
	Usuario.findOne({ email }).then(async (usuario) => {
		if (!usuario) {
			return res.status(404).json({
				ok: false,
				errores: {
					email: {
						value: email,
						msg: 'El correo no fue registrado',
						param: 'email',
						location: 'body',
					},
				},
			});
		}
		const validPassword = bcrypt.compareSync(password, usuario.password);
		if (!validPassword) {
			return res.status(400).json({
				ok: false,
				errores: {
					password: {
						value: password,
						msg: 'Contraseña incorrecta',
						param: 'password',
						location: 'body',
					},
				},
			});
		}
		// Generar el JWT
		const token = await generarJWT(usuario.id);
		res.json({
			ok: true,
			usuario,
			token,
		});
	});
};

const renewToken = async (req = request, res = response) => {
	// obtener el uid
	const { uid } = req;
	// Generar nuevo JWT
	const token = await generarJWT(uid);
	// Obtener el usuario por el uid
	const usuario = await Usuario.findById(uid);
	res.json({
		ok: true,
		usuario,
		token,
	});
};

module.exports = {
	crearUsuario,
	login,
	renewToken,
};
