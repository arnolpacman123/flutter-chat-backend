const { request, response } = require('express');
const Usuario = require('../models/usuario');

const getUsuarios = async (req = request, res = response) => {
	const desde = Number(req.query.desde) || 0;

	const usuarios = await Usuario.find({ _id: { $ne: req.uid } })
		.sort('-online')
		.skip(desde)
		.limit(20);
	res.json({
		ok: true,
		usuarios,
		desde,
	});
};

module.exports = {
	getUsuarios,
};
