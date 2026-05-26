// Polyfill completo para Node (Mongoose requiere crypto global)
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
const conectarDB = require('./config/database');

const PORT = process.env.PORT || 3005;

conectarDB();

const server = app.listen(PORT, () => {
    console.log(`Servicio de Usuarios ejecutándose en el puerto ${PORT}`);
    console.log(`Ambiente de ejecución: ${process.env.NODE_ENV || 'desarrollo'}`);
});

process.on('unhandledRejection', (err, promise) => {
    console.log(`Error crítico: ${err.message}`);
    server.close(() => process.exit(1));
});
