require('dotenv').config();
const app = require('./app');

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(` API Gateway escuchando en el puerto ${PORT}`);
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
