const express = require('express');
const cors = require('cors');
const repartidorRoutes = require('./routes/repartidor.routes');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
    res.json({
        ok: true,
        service: 'repartidores-service',
        status: 'running'
    });
});

app.use('/api/repartidores', repartidorRoutes);

module.exports = app;