const { io } = require('../index');
const { comprobarJWT } = require('../helpers/jwt');
const {
	usuarioConectado,
	usuarioDesconectado,
	grabarMensaje,
} = require('../controllers/socket');

// Mensajes de Sockets
io.on('connection', async (client) => {
	console.log('Cliente conectado');

	const token = client.handshake.headers['x-token'];
	const [valido, uid] = comprobarJWT(token);

	// Verificar autenticación
	if (!valido) {
		client.disconnect();
		return;
	}

	// Cliente autenticado
	await usuarioConectado(uid);

	// Ingresar al usuario a una sala en particular
	// Sala global, client.id, 61da4e1a945342807b6e8b3d
	client.join(uid);

	// Escuchar del cliente el mensaje-personal
	client.on('mensaje-personal', async (payload) => {
		// TODO: grabar mensaje
		await grabarMensaje(payload);
		io.to(payload.para).emit('mensaje-personal', payload);
	});

	client.on('disconnect', async () => {
		await usuarioDesconectado(uid);
	});
});
