const express = require('express');
const router = express.Router();
const enrutamientoController = require('../controllers/enrutamiento.controller');

// Ruta para calcular la sucursal más cercana
router.post('/calcular-cercana', enrutamientoController.obtenerSucursalMasCercana);

module.exports = router;
