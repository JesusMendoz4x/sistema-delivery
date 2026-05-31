const express = require('express');
const cors = require('cors');
const path = require('path');
const inventarioRoutes = require('./routes/inventario.routes');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Middleware de logs con Correlation-ID
app.use((req, res, next) => {
    const correlationId = req.headers['x-correlation-id'] || 'N/A';
    req.correlationId = correlationId;
    console.log(`[Inventario Service] [Correlation-ID: ${correlationId}] ${req.method} ${req.originalUrl}`);
    next();
});

app.get('/health', (req, res) => {
	res.json({
		ok: true,
		service: 'inventario-service',
		status: 'running'
	});
});

app.use('/api/inventario', inventarioRoutes);

module.exports = app;