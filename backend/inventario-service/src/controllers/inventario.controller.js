const Producto = require('../models/Producto');
const Inventario = require('../models/Inventario');

function normalizarProductoPayload(body = {}) {
    const {
        nombre,
        descripcion,
        categoria,
        precio,
        disponible,
        imagen,
        imagenUrl,
        foto,
        icono,
        destacado
    } = body;

    return {
        nombre,
        descripcion,
        categoria,
        precio,
        disponible,
        imagen: imagen || imagenUrl || foto || '',
        icono: icono || 'restaurant',
        destacado: destacado === true || destacado === 'true' || destacado === 'on' || destacado === 1 || destacado === '1'
    };
}

// 1. Listar catálogo de productos general
async function listarProductos(req, res) {
    try {
        const productos = await Producto.find().sort({ createdAt: -1 });
        res.json(productos);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el catálogo de productos', error: error.message });
    }
}

// 2. Obtener producto por ID del catálogo general
async function obtenerProductoPorId(req, res) {
    try {
        const producto = await Producto.findById(req.params.id);

        if (!producto) {
            return res.status(404).json({ message: 'Producto no encontrado en el catálogo' });
        }

        res.json(producto);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el producto', error: error.message });
    }
}

// 3. Crear nuevo producto en el catálogo general (Sin stock global)
async function crearProducto(req, res) {
    try {
        const productoData = normalizarProductoPayload(req.body);

        const producto = await Producto.create({
            ...productoData
        });

        res.status(201).json(producto);
    } catch (error) {
        res.status(400).json({ message: 'No se pudo crear el producto en el catálogo', error: error.message });
    }
}

// 4. Actualizar producto del catálogo general
async function actualizarProducto(req, res) {
    try {
        const producto = await Producto.findByIdAndUpdate(req.params.id, normalizarProductoPayload(req.body), {
            returnDocument: 'after',
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

// 5. Eliminar producto del catálogo (y sus inventarios asociados)
async function eliminarProducto(req, res) {
    try {
        const producto = await Producto.findByIdAndDelete(req.params.id);

        if (!producto) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        // Eliminar también las referencias de stock en todas las sucursales para este producto
        await Inventario.deleteMany({ productoId: req.params.id });

        res.json({ message: 'Producto y sus existencias de inventario eliminados correctamente' });
    } catch (error) {
        res.status(500).json({ message: 'No se pudo eliminar el producto', error: error.message });
    }
}

// ==========================================
// NUEVAS FUNCIONALIDADES DE STOCK POR SUCURSAL
// ==========================================

// 6. Obtener el inventario completo de una sucursal específica
async function obtenerInventarioSucursal(req, res) {
    try {
        const { sucursalId } = req.params;
        const inventarios = await Inventario.find({ sucursalId }).populate('productoId');
        res.json(inventarios);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el inventario de la sucursal', error: error.message });
    }
}

// 7. Inicializar o actualizar el stock de un producto en una sucursal (Usando Upsert)
async function actualizarStockSucursal(req, res) {
    try {
        const { productoId, sucursalId, stock } = req.body;

        if (!productoId || !sucursalId || stock === undefined) {
            return res.status(400).json({ message: 'Datos incompletos: se requiere productoId, sucursalId y stock.' });
        }

        // Validar primero que el producto exista en el catálogo maestro
        const productoExiste = await Producto.findById(productoId);
        if (!productoExiste) {
            return res.status(404).json({ message: 'El producto no existe en el catálogo maestro' });
        }

        // Buscar y actualizar. Si no existe, lo crea de manera automática (upsert)
        const inventario = await Inventario.findOneAndUpdate(
            { productoId, sucursalId },
            { stock },
            { returnDocument: 'after', upsert: true, runValidators: true }
        );

        res.json({
            ok: true,
            message: 'Stock de sucursal actualizado exitosamente',
            data: inventario
        });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el stock de la sucursal', error: error.message });
    }
}

// 8. VALIDACIÓN Y DESCUENTO ATÓMICO (Lógica crítica para creación de pedidos)
async function validarYDescontarStock(req, res) {
    try {
        const { sucursalId, productos } = req.body; // productos: [{ productoId, cantidad }]

        if (!sucursalId || !productos || !Array.isArray(productos) || productos.length === 0) {
            return res.status(400).json({ message: 'Datos incompletos: se requiere sucursalId y un arreglo de productos.' });
        }

        const productosSinStock = [];
        const registrosParaActualizar = [];

        // Fase 1: Validación - Comprobar stock de todos los productos antes de alterar nada en base de datos
        for (const item of productos) {
            const inv = await Inventario.findOne({ productoId: item.productoId, sucursalId });

            if (!inv || inv.stock < item.cantidad) {
                productosSinStock.push({
                    productoId: item.productoId,
                    stockDisponible: inv ? inv.stock : 0,
                    cantidadSolicitada: item.cantidad
                });
            } else {
                registrosParaActualizar.push({ registro: inv, cantidad: item.cantidad });
            }
        }

        // Si al menos un producto no tiene stock, cancelamos todo el proceso para evitar un descuento incompleto
        if (productosSinStock.length > 0) {
            return res.status(400).json({
                ok: false,
                message: 'Existencias insuficientes para procesar el pedido en esta sucursal.',
                sinStock: productosSinStock
            });
        }

        // Fase 2: Descuento - Si todos tienen stock, procedemos con la resta de existencias
        for (const item of registrosParaActualizar) {
            item.registro.stock -= item.cantidad;
            await item.registro.save();
        }

        res.json({
            ok: true,
            message: 'Stock validado y descontado exitosamente en la sucursal.'
        });

    } catch (error) {
        res.status(500).json({ message: 'Error en la validación y descuento de stock', error: error.message });
    }
}

module.exports = {
    listarProductos,
    obtenerProductoPorId,
    crearProducto,
    actualizarProducto,
    eliminarProducto,
    obtenerInventarioSucursal,
    actualizarStockSucursal,
    validarYDescontarStock
};