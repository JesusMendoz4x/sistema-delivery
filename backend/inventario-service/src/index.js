// Polyfill completo para Node (Mongoose v9 / MongoDB v7 requieren crypto global)
const nodeCrypto = require('crypto');
if (!global.crypto) {
    global.crypto = {};
}
if (!global.crypto.getRandomValues) {
    if (nodeCrypto.webcrypto && nodeCrypto.webcrypto.getRandomValues) {
        global.crypto.getRandomValues = function (arr) {
            return nodeCrypto.webcrypto.getRandomValues(arr);
        };
    } else {
        global.crypto.getRandomValues = function (arr) {
            const bytes = nodeCrypto.randomBytes(arr.length);
            for (let i = 0; i < arr.length; i++) {
                arr[i] = bytes[i];
            }
            return arr;
        };
    }
}
if (!global.crypto.randomUUID) {
    global.crypto.randomUUID = function () {
        return nodeCrypto.randomUUID ? nodeCrypto.randomUUID() : () => {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        };
    };
}

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