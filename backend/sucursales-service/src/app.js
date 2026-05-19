//Importamos el framework Express
const express = require('express');
const cors = require('cors');

// Importamos las rutas
const sucursalRoutes = require('./routes/sucursal.routes')

//Inicializamos Express
const app = express();

// 1. MIDDLEWARES GLOBALES
app.use(cors()); // Habilitar CORS para todas las rutas
app.use(express.json()); // Middleware para parsear JSON en el cuerpo de las solicitudes

// 2. RUTAS
app.use('/api/sucursales', sucursalRoutes); // Usamos las rutas de sucursales

// 3. ENDPOINT DE ESTATUS (Healthcheck)
app.get('/api/health', (req, res) => {
    res.status(200).json({estado: 'ok', servicio: 'sucursales-service'});
});

//Exportamos el módulo app para usarlo en otros archivos
module.exports = app;