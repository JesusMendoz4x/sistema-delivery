// 1. Cargar las variables de entorno antes de ejecutar cualquier otra cosa
require('dotenv').config();

// 2. Importar el núcleo de la aplicación y la conexión a la base de datos
const app = require('./app');
const conectarDB = require('./config/database');

// 3. Definir el puerto (3002 para el servicio de sucursales)
const PORT = process.env.PORT || 3002;

// 4. Ejecutar la conexión a la base de datos
conectarDB();

// 5. Encender el servidor para que escuche peticiones
const server = app.listen(PORT, () => {
    console.log(`Servicio de Sucursales ejecutándose en el puerto ${PORT}`);
    console.log(`Ambiente de ejecución: ${process.env.NODE_ENV || 'desarrollo'}`);
});

// BUENA PRÁCTICA LABORAL: Manejo de errores no controlados (Unhandled Promise Rejections)
// Si algo falla catastróficamente fuera de los controladores (ej. se cae el servidor de Mongo después de iniciar)
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error crítico: ${err.message}`);
    // Cerramos el servidor de forma segura antes de detener el proceso
    server.close(() => process.exit(1));
});