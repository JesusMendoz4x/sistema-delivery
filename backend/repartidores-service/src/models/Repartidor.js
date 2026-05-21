const mongoose = require('mongoose');

const repartidorSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre del repartidor es obligatorio'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'El correo electrónico del repartidor es obligatorio'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Por favor ingrese un correo electrónico válido']
    },
    telefono: {
        type: String,
        required: [true, 'El teléfono del repartidor es obligatorio'],
        trim: true,
    },
    vehiculo: {
        tipo: {
            type: String,
            required: [true, 'El tipo de vehículo del repartidor es obligatorio'],
            enum: {
                values: ['motocicleta', 'bicicleta', 'automóvil', 'a pie'],
                message: '{VALUE} no es un tipo de vehículo válido (motocicleta, bicicleta, automóvil, a pie)'
            }
        },
        placa: {
            type: String,
            trim: true,
            default: ''
        }
    },
    ubicacion: {
        latitud: {
            type: Number,
            required: [true, 'La latitud de la ubicación del repartidor es obligatoria'],
        },
        longitud: {
            type: Number,
            required: [true, 'La longitud de la ubicación del repartidor es obligatoria'],
        },
    },
    capacidadOperativa: {
        type: Number,
        required: [true, 'La capacidad operativa del repartidor es obligatoria'],
        min: [1, 'La capacidad operativa debe ser al menos 1'],
        default: 3,
    },
    estado: {
        type: String,
        enum: {
            values: ['disponible', 'en_ruta', 'inactivo'],
            message: '{VALUE} no es un estado válido (disponible, en_ruta, inactivo)'
        },
        default: 'disponible'
    }
}, {
    timestamps: true,
});

module.exports = mongoose.model('Repartidor', repartidorSchema);
