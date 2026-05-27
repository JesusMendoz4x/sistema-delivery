const express = require('express');
const {
    listarUsuarios,
    obtenerUsuarioPorId,
    crearUsuario,
    actualizarUsuario,
    desactivarUsuario,
    activarUsuario,
    loginUsuario
} = require('../controllers/usuario.controller');

const router = express.Router();

router.post('/login', loginUsuario);
router.get('/', listarUsuarios);
router.get('/:id', obtenerUsuarioPorId);
router.post('/', crearUsuario);
router.put('/:id', actualizarUsuario);
router.delete('/:id/desactivar', desactivarUsuario);
router.put('/:id/activar', activarUsuario);

module.exports = router;
