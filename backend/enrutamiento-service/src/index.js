require('dotenv').config();

const app = require('./app');
const conectarDB = require('./config/database');

const PORT = process.env.PORT || 3007;

conectarDB();

const server = app.listen(PORT, () => {
    console.log(`Servicio de Enrutamiento ejecutándose en el puerto ${PORT}`);
    console.log(`Ambiente de ejecución: ${process.env.NODE_ENV || 'desarrollo'}`);
});

process.on('unhandledRejection', (err, promise) => {
    console.log(`Error crítico: ${err.message}`);
    server.close(() => process.exit(1));
});
