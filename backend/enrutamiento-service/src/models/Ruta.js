const mongoose = require('mongoose');

const rutaSchema = new mongoose.Schema({
    repartidorId: {
        type: String,
        required: [true, 'El ID del repartidor es obligatorio'],
        trim: true,
    },
    pedidos: [{
        type: String,
        required: [true, 'El ID del pedido es obligatorio']
    }],
    estado: {
        type: String,
        enum: {
            values: ['asignada', 'en_curso', 'completada', 'cancelada'],
            message: '{VALUE} no es un estado válido (asignada, en_curso, completada, cancelada)'
        },
        default: 'asignada'
    },
    distanciaEstimadaKm: {
        type: Number,
        min: 0,
        default: 0
    },
    tiempoEstimadoMinutos: {
        type: Number,
        min: 0,
        default: 0
    },
    ubicacionActual: {
        latitud: {
            type: Number,
            required: function() {
                return this.estado === 'en_curso'; // Sólo requerida si la ruta está en curso
            }
        },
        longitud: {
            type: Number,
            required: function() {
                return this.estado === 'en_curso';
            }
        }
    }
}, {
    timestamps: true,
});

module.exports = mongoose.model('Ruta', rutaSchema);
