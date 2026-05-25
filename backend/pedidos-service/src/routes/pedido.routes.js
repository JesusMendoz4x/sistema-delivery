const express = require('express');
const router = express.Router();
const pedidoController = require('../controllers/pedido.controller');

// Rutas de la API de Pedidos
router.post('/', pedidoController.crearPedido);
router.get('/', pedidoController.listarPedidos);
router.get('/:id', pedidoController.obtenerPedidoPorId);
router.put('/:id/estado', pedidoController.actualizarEstadoPedido);

module.exports = router;
