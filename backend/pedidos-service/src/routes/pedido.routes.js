const express = require('express');
const {
    listarPedidos,
    obtenerPedidoPorId,
    crearPedido,
    actualizarEstadoPedido,
    asignarRepartidor,
    obtenerMetricasDashboard // Importar el nuevo controlador
} = require('../controllers/pedido.controller');

const router = express.Router();

// 1. Declarar primero las rutas estáticas específicas
router.get('/metricas', obtenerMetricasDashboard);

// 2. Declarar después las rutas parametrizadas genéricas
router.get('/', listarPedidos);
router.get('/:id', obtenerPedidoPorId);
router.post('/', crearPedido);
router.put('/:id/estado', actualizarEstadoPedido);
router.put('/:id/repartidor', asignarRepartidor);

module.exports = router;
