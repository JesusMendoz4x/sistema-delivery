const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
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

const uploadDir = path.join(__dirname, '..', '..', 'uploads');
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {
        const safeName = file.originalname.toLowerCase().replace(/[^a-z0-9.]+/g, '-');
        cb(null, `${Date.now()}-${safeName}`);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith('image/')) {
            return cb(new Error('Solo se permiten archivos de imagen'));
        }
        cb(null, true);
    }
});

// Rutas para el catálogo maestro de Productos
router.get('/', listarProductos);
router.get('/:id', obtenerProductoPorId);
router.post('/', upload.single('imagenArchivo'), crearProducto);
router.put('/:id', upload.single('imagenArchivo'), actualizarProducto);
router.delete('/:id', eliminarProducto);

// NUEVAS RUTAS: Control y validación de inventario físico por Sucursal
router.get('/sucursal/:sucursalId', obtenerInventarioSucursal);
router.post('/stock', actualizarStockSucursal);
router.post('/validar-y-descontar', validarYDescontarStock);

module.exports = router;