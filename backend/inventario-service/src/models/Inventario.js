const mongoose = require('mongoose');

const inventarioSchema = new mongoose.Schema({
    productoId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Producto', // Vinculación con el catálogo general de Productos
        required: [true, 'El ID del producto es obligatorio']
    },
    sucursalId: {
        type: String, // String porque las sucursales viven en su propio microservicio
        required: [true, 'El ID de la sucursal es obligatorio'],
        trim: true
    },
    stock: {
        type: Number,
        required: [true, 'El stock es obligatorio'],
        min: [0, 'El stock no puede ser negativo'],
        default: 0
    }
}, {
    timestamps: true
});

// Índice único compuesto para acelerar búsquedas y evitar duplicados de un mismo producto en la misma sucursal
inventarioSchema.index({ productoId: 1, sucursalId: 1 }, { unique: true });

module.exports = mongoose.model('Inventario', inventarioSchema);
