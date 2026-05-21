const express = require('express');
const cors = require('cors');
const usuarioRoutes = require('./routes/usuario.routes');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
    res.json({
        ok: true,
        service: 'usuario-service',
        status: 'running'
    });
});

app.use('/api/usuarios', usuarioRoutes);

module.exports = app;
