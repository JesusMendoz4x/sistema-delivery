const express = require('express');
const router = express.Router();
const sucursalController = require('../controllers/sucursal.controller');

// Definir los endpoints para las sucursales usando HTTP
router.post('/', sucursalController.crearSucursal); // Crear una nueva sucursal
router.get('/', sucursalController.listarSucursales); // Listar todas las sucursales
router.get('/:id', sucursalController.obtenerSucursalPorId); // Obtener una sucursal por ID
router.put('/:id', sucursalController.actualizarSucursal); // Actualizar una sucursal por ID
router.delete('/:id', sucursalController.desactivarSucursal); // Desactivar una sucursal por ID

module.exports = router;
