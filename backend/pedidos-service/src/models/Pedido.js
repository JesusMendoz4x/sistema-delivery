const mongoose = require('mongoose');

const PedidoSchema = new mongoose.Schema({
    cliente: {
        nombre: {
            type: String,
            required: [true, 'El nombre del cliente es obligatorio'],
            trim: true
        },
        direccion: {
            type: String,
            required: [true, 'La dirección de entrega es obligatoria'],
            trim: true
        },
        ubicacion: {
            latitud: {
                type: Number,
                required: [true, 'La latitud del cliente es obligatoria']
            },
            longitud: {
                type: Number,
                required: [true, 'La longitud del cliente es obligatoria']
            }
        }
    },
    productos: [
        {
            productoId: {
                type: String,
                required: [true, 'El ID del producto es obligatorio']
            },
            nombre: {
                type: String,
                required: [true, 'El nombre del producto es obligatorio']
            },
            cantidad: {
                type: Number,
                required: [true, 'La cantidad es obligatoria'],
                min: [1, 'La cantidad mínima es 1']
            },
            precio: {
                type: Number,
                required: [true, 'El precio del producto es obligatorio'],
                min: [0, 'El precio no puede ser negativo']
            }
        }
    ],
    total: {
        type: Number,
        required: [true, 'El monto total del pedido es obligatorio'],
        min: [0, 'El total no puede ser negativo']
    },
    estado: {
        type: String,
        enum: {
            values: ['PENDIENTE', 'PREPARANDO', 'EN_CAMINO', 'ENTREGADO', 'CANCELADO'],
            message: '{VALUE} no es un estado válido (PENDIENTE, PREPARANDO, EN_CAMINO, ENTREGADO, CANCELADO)'
        },
        default: 'PENDIENTE'
    },
    historialEstados: [
        {
            estado: {
                type: String,
                required: true
            },
            fecha: {
                type: Date,
                default: Date.now
            }
        }
    ]
}, {
    timestamps: true
});

// Middleware pre-save para inicializar el historial de estados al crearse el pedido
PedidoSchema.pre('save', function () {
    if (this.isNew) {
        this.historialEstados.push({
            estado: this.estado,
            fecha: new Date()
        });
    }
});

module.exports = mongoose.model('Pedido', PedidoSchema);
