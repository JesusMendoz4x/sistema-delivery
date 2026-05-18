require('dotenv').config();

const app = require('./app');
const { connectDB } = require('./config/database');

const PORT = process.env.PORT || 3001;

async function startServer() {
    try {
        await connectDB(process.env.MONGODB_URI);
    } catch (error) {
        console.warn('No se pudo conectar a MongoDB. El servidor continuará levantado para desarrollo.');
        console.warn(error.message);
    }

    app.listen(PORT, () => {
        console.log(`Servidor de inventario escuchando en el puerto ${PORT}`);
    });
}

startServer();