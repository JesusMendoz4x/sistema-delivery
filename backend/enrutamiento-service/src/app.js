const express = require('express');
const cors = require('cors');
const enrutamientoRoutes = require('./routes/enrutamiento.routes');

const app = express();

// Middlewares globales
app.use(cors());
app.use(express.json());

// Registro de rutas
app.use('/api/enrutamiento', enrutamientoRoutes);

// Endpoint de Healthcheck
app.get('/api/health', (req, res) => {
    res.status(200).json({ estado: 'ok', servicio: 'enrutamiento-service' });
});

module.exports = app;
