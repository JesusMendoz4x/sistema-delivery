const express = require('express');
const cors = require('cors');
const inventarioRoutes = require('./routes/inventario.routes');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
	res.json({
		ok: true,
		service: 'inventario-service',
		status: 'running'
	});
});

app.use('/api/inventario', inventarioRoutes);

module.exports = app;