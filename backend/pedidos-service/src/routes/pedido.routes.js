const express = require('express');
const {
    listarPedidos,
    obtenerPedidoPorId,
    crearPedido,
    actualizarEstadoPedido,
    asignarRepartidor
} = require('../controllers/pedido.controller');

const router = express.Router();

router.get('/', listarPedidos);
router.get('/:id', obtenerPedidoPorId);
router.post('/', crearPedido);
router.put('/:id/estado', actualizarEstadoPedido);
router.put('/:id/repartidor', asignarRepartidor);

module.exports = router;
