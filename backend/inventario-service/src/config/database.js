const mongoose = require('mongoose');

async function connectDB(uri) {
	if (!uri) {
		console.warn('MONGODB_URI no está configurada. El servicio iniciará sin conexión a base de datos.');
		return null;
	}

	await mongoose.connect(uri);
	console.log('Conexión a MongoDB establecida');
	return mongoose.connection;
}

module.exports = { connectDB };
