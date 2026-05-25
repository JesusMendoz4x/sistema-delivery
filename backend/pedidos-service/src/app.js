const express = require('express');
const cors = require('cors');
const pedidoRoutes = require('./routes/pedido.routes');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
    res.json({
        ok: true,
        service: 'pedidos-service',
        status: 'running'
    });
});

app.use('/api/pedidos', pedidoRoutes);

module.exports = app;
