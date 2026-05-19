const mongoose = require('mongoose');

const conectarDB = async () => {
    try {

        // Conectar a MongoDB usando la URI del entorno o de una URL de conexión local
        const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/sucursalesdb';

        const connection = await mongoose.connect(uri);

        
        console.log(`Base de datos conectada exitosamente: ${connection.connection.host}`);
    } catch (error) {
        console.error(`Error al conectar a la base de datos: ${error.message}`);
        process.exit(1); // Salir del proceso con error
    }
};

module.exports = conectarDB;