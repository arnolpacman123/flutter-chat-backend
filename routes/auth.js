/**
 * path: api/login
 */
const { Router } = require('express');
const { check, body } = require('express-validator');

const { crearUsuario, login, renewToken } = require('../controllers/auth');
const {
	validarCampos,
	userExistsByEmail,
} = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

router.post(
	'/new',
	[
		check('nombre', 'El nombre es obligatorio').not().isEmpty(),
		check('email', 'El email es obligatorio').not().isEmpty(),
		check('email', 'No es un email válido').isEmail(),
		check('password', 'La contraseña es obligatoria').not().isEmpty(),
		body('email').custom((email) => {
			return userExistsByEmail(email);
		}),
		validarCampos,
	],
	crearUsuario
);

router.post(
	'/',
	[
		check('email', 'El email es obligatorio').not().isEmpty(),
		check('email', 'No es un email válido').isEmail(),
		check('password', 'La contraseña es obligatoria').not().isEmpty(),
		validarCampos,
	],
	login
);

router.get('/renew', validarJWT, renewToken);

module.exports = router;
