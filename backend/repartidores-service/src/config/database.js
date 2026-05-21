const mongoose = require('mongoose');

const conectarDB = async () => {
    try {

        const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/repartidoresdb';

        const connection = await mongoose.connect(uri);

        console.log(`Base de datos conectada exitosamente: ${connection.connection.host}`);
    } catch (error) {
        console.error(`Error al conectar a la base de datos: ${error.message}`);
        process.exit(1);
    }
};

module.exports = conectarDB;