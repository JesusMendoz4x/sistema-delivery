const mongoose = require('mongoose');

const productoSchema = new mongoose.Schema(
    {
        nombre: {
            type: String,
            required: true,
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
            required: true,
            min: 0
        },
        stock: {
            type: Number,
            required: true,
            min: 0,
            default: 0
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