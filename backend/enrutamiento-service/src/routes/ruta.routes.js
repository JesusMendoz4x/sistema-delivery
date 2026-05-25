const express = require('express');
const {
    listarRutas,
    obtenerRutaPorId,
    crearRuta,
    actualizarEstadoRuta,
    actualizarUbicacionRuta
} = require('../controllers/ruta.controller');

const router = express.Router();

router.get('/', listarRutas);
router.get('/:id', obtenerRutaPorId);
router.post('/', crearRuta);
router.put('/:id/estado', actualizarEstadoRuta);
router.put('/:id/ubicacion', actualizarUbicacionRuta);

module.exports = router;
