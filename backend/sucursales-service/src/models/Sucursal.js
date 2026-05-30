const mongoose = require('mongoose');

const SucursalSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre de la sucursal es obligatorio'],
        trim: true,
    },
    direccion: {
        type: String,
        required: [true, 'La dirección física de la sucursal es obligatoria'],
        trim: true,
    },
    ubicacion: {
        latitud: {
            type: Number,
            required: [true, 'La latitud de la sucursal es obligatoria'],
        },
        longitud: {
            type: Number,
            required: [true, 'La longitud de la sucursal es obligatoria'],
        },
    },
    capacidadOperativa: {
        type: Number,
        required: [true, 'La capacidad operativa de la sucursal es obligatoria'],
        min: [1, 'La capacidad operativa debe ser al menos 1'],
    },
    estado: {
        type: Boolean,
        default: true, // true = activa, false = inactiva
    }
}, {
    timestamps: true,
});

module.exports = mongoose.model('Sucursal', SucursalSchema);
