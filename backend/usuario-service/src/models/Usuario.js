const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre del usuario es obligatorio'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'El correo electrónico es obligatorio'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Por favor ingrese un correo electrónico válido']
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria'],
        minlength: [6, 'La contraseña debe tener al menos 6 caracteres']
    },
    telefono: {
        type: String,
        required: [true, 'El teléfono es obligatorio'],
        trim: true,
    },
    direccion: {
        type: String,
        trim: true,
        default: ''
    },
    rol: {
        type: String,
        enum: {
            values: ['cliente', 'admin', 'sucursal'],
            message: '{VALUE} no es un rol válido (cliente, admin, sucursal)'
        },
        default: ''
    },
    estado: {
        type: String,
        enum: {
            values: ['activo', 'inactivo'],
            message: '{VALUE} no es un estado válido (activo, inactivo)'
        },
        default: 'activo'
    }
}, {
    timestamps: true,
});

module.exports = mongoose.model('Usuario', usuarioSchema);
