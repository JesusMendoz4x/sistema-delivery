const express = require('express');
const {
    listarRepartidores,
    obtenerRepartidorPorId,
    crearRepartidor,
    actualizarRepartidor,
    desactivarRepartidor,
    activarRepartidor,
    asignarRepartidorDisponible
} = require('../controllers/repartidor.controller');

const router = express.Router();

router.get('/', listarRepartidores);
router.get('/:id', obtenerRepartidorPorId);
router.post('/', crearRepartidor);
router.put('/:id', actualizarRepartidor);
router.delete('/:id/desactivar', desactivarRepartidor);
router.put('/:id/activar', activarRepartidor);
router.post('/asignar', asignarRepartidorDisponible);

module.exports = router;

