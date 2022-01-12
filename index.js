const express = require('express');
const path = require('path');
require('dotenv').config();

// DB config
const { dbConnection } = require('./database/config');
dbConnection();

// App de Express
const app = express();

// Lectura y parseo del Body
app.use(express.json());

// Node Server
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
module.exports.io = new Server(server);
require('./sockets/socket');

// Path público
const publicPath = path.resolve(__dirname, 'public');
app.use(express.static(publicPath));

// Rutas
const routesAuth = require('./routes/auth');
const routesUsuarios = require('./routes/usuarios');
const routesMensajes = require('./routes/mensajes');
app.use('/api/login', routesAuth);
app.use('/api/usuarios', routesUsuarios);
app.use('/api/mensajes', routesMensajes);

server.listen(process.env.PORT, (error) => {
    if (error) throw new Error(error);
    console.log(`Servidor corriendo en puerto ${process.env.PORT}`);
});