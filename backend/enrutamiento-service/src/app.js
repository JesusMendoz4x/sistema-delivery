const express = require('express');
const cors = require('cors');
const enrutamientoRoutes = require('./routes/enrutamiento.routes');
const rutaRoutes = require('./routes/ruta.routes');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
    res.json({
        ok: true,
        service: 'enrutamiento-service',
        status: 'running'
    });
});

app.use('/api/enrutamiento', enrutamientoRoutes);
app.use('/api/rutas', rutaRoutes);

module.exports = app;
