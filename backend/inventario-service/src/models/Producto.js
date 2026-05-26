const mongoose = require('mongoose');

const productoSchema = new mongoose.Schema(
    {
        nombre: {
            type: String,
            required: [true, 'El nombre del producto es obligatorio'],
            trim: true
        },
        descripcion: {
            type: String,
            trim: true,
            default: ''
        },
        categoria: {
            type: String,
            trim: true,
            default: 'general'
        },
        precio: {
            type: Number,
            required: [true, 'El precio es obligatorio'],
            min: [0, 'El precio no puede ser negativo']
        },
        disponible: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Producto', productoSchema);