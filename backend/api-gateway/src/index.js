require('dotenv').config();
const app = require('./app');

const http = require('http');
const { Server } = require('socket.io');

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: [
            'http://localhost', 'http://127.0.0.1', // Puerto 80 del Frontend Dockerizado
            'http://localhost:5173', 'http://127.0.0.1:5173',
            'http://localhost:5174', 'http://127.0.0.1:5174',
            'http://localhost:5175', 'http://127.0.0.1:5175'
        ],
        methods: ['GET', 'POST']
    }
});

// Registrar Socket.io en el app para usarlo en controladores de Express
app.set('io', io);

io.on('connection', (socket) => {
    console.log(`[API Gateway] [WS] Cliente conectado: ${socket.id}`);

    // Unirse a sala de pedido para actualizaciones en tiempo real
    socket.on('join_pedido', (pedidoId) => {
        socket.join(`pedido_${pedidoId}`);
        console.log(`[API Gateway] [WS] Cliente ${socket.id} se unió al pedido_${pedidoId}`);
    });

    socket.on('disconnect', () => {
        console.log(`[API Gateway] [WS] Cliente desconectado: ${socket.id}`);
    });
});

server.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(` API Gateway + WebSockets escuchando en el puerto ${PORT}`);
    console.log(` Entorno: ${process.env.NODE_ENV || 'desarrollo'}`);
    console.log(`====================================================`);
});

// Capturar errores específicos del servidor HTTP (como puerto ocupado EADDRINUSE)
server.on('error', (err) => {
    console.error(`\n[Error de Servidor en API Gateway]:`);
    if (err.code === 'EADDRINUSE') {
        console.error(` El puerto ${PORT} ya está siendo utilizado por otro proceso.`);
        console.error(` Tip en macOS: El puerto 5000 suele estar reservado por "AirPlay Receiver".`);
        console.error(`   Puedes desactivarlo en: Ajustes del Sistema -> General -> AirDrop y Handoff -> Receptor de AirPlay.`);
    } else {
        console.error(err.message);
    }
    process.exit(1);
});

// Manejo de errores no controlados para evitar caídas silenciosas
process.on('unhandledRejection', (err) => {
    console.error(`\n[Error crítico no controlado (Rejection)]: ${err.stack || err.message}`);
    server.close(() => process.exit(1));
});

process.on('uncaughtException', (err) => {
    console.error(`\n[Error crítico no controlado (Exception)]: ${err.stack || err.message}`);
    server.close(() => process.exit(1));
});
