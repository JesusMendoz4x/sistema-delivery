const express = require('express');
const cors = require('cors');
const usuarioRoutes = require('./routes/usuario.routes');

const app = express();

app.use(cors());
app.use(express.json());

// Middleware de logs con Correlation-ID
app.use((req, res, next) => {
    const correlationId = req.headers['x-correlation-id'] || 'N/A';
    req.correlationId = correlationId;
    console.log(`[Usuarios Service] [Correlation-ID: ${correlationId}] ${req.method} ${req.originalUrl}`);
    next();
});

app.get('/health', (req, res) => {
    res.json({
        ok: true,
        service: 'usuario-service',
        status: 'running'
    });
});

app.use('/api/usuarios', usuarioRoutes);

module.exports = app;
