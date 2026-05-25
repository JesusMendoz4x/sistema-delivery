const express = require('express');
const cors = require('cors');
const pedidoRoutes = require('./routes/pedido.routes');

const app = express();

// Middlewares globales
app.use(cors());
app.use(express.json());

// Registro de rutas
app.use('/api/pedidos', pedidoRoutes);

// Endpoint de Healthcheck
app.get('/api/health', (req, res) => {
    res.status(200).json({ estado: 'ok', servicio: 'pedidos-service' });
});

module.exports = app;
