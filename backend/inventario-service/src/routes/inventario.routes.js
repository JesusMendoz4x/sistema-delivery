const express = require('express');
const {
    listarProductos,
    obtenerProductoPorId,
    crearProducto,
    actualizarProducto,
    eliminarProducto,
    obtenerInventarioSucursal,
    actualizarStockSucursal,
    validarYDescontarStock
} = require('../controllers/inventario.controller');

const router = express.Router();

// Rutas para el catálogo maestro de Productos
router.get('/', listarProductos);
router.get('/:id', obtenerProductoPorId);
router.post('/', crearProducto);
router.put('/:id', actualizarProducto);
router.delete('/:id', eliminarProducto);

// NUEVAS RUTAS: Control y validación de inventario físico por Sucursal
router.get('/sucursal/:sucursalId', obtenerInventarioSucursal);
router.post('/stock', actualizarStockSucursal);
router.post('/validar-y-descontar', validarYDescontarStock);

module.exports = router;