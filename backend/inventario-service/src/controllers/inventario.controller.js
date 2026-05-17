const Producto = require('../models/Producto');

async function listarProductos(req, res) {
    try {
        const productos = await Producto.find().sort({ createdAt: -1 });
        res.json(productos);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el inventario', error: error.message });
    }
}

async function obtenerProductoPorId(req, res) {
    try {
        const producto = await Producto.findById(req.params.id);

        if (!producto) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        res.json(producto);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el producto', error: error.message });
    }
}

async function crearProducto(req, res) {
    try {
        const { nombre, descripcion, categoria, precio, stock, disponible } = req.body;

        const producto = await Producto.create({
            nombre,
            descripcion,
            categoria,
            precio,
            stock,
            disponible
        });

        res.status(201).json(producto);
    } catch (error) {
        res.status(400).json({ message: 'No se pudo crear el producto', error: error.message });
    }
}

async function actualizarProducto(req, res) {
    try {
        const producto = await Producto.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if (!producto) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        res.json(producto);
    } catch (error) {
        res.status(400).json({ message: 'No se pudo actualizar el producto', error: error.message });
    }
}

async function eliminarProducto(req, res) {
    try {
        const producto = await Producto.findByIdAndDelete(req.params.id);

        if (!producto) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        res.json({ message: 'Producto eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ message: 'No se pudo eliminar el producto', error: error.message });
    }
}

module.exports = {
    listarProductos,
    obtenerProductoPorId,
    crearProducto,
    actualizarProducto,
    eliminarProducto
};