const mongoose = require('mongoose');

const pedidoSchema = new mongoose.Schema({
    clienteId: {
        type: String,
        required: [true, 'El ID del cliente es obligatorio'],
        trim: true,
    },
    repartidorId: {
        type: String,
        trim: true,
        default: null
    },
    sucursalId: {
        type: String,
        required: [true, 'El ID de la sucursal es obligatorio'],
        trim: true,
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
            precioUnitario: {
                type: Number,
                required: [true, 'El precio unitario es obligatorio'],
                min: 0
            },
            cantidad: {
                type: Number,
                required: [true, 'La cantidad es obligatoria'],
                min: [1, 'La cantidad debe ser al menos 1']
            }
        }
    ],
    total: {
        type: Number,
        required: [true, 'El total del pedido es obligatorio'],
        min: 0
    },
    direccionEntrega: {
        type: String,
        required: [true, 'La dirección de entrega es obligatoria'],
        trim: true
    },
    estado: {
        type: String,
        enum: {
            values: ['pendiente', 'preparando', 'en_camino', 'entregado', 'cancelado'],
            message: '{VALUE} no es un estado válido (pendiente, preparando, en_camino, entregado, cancelado)'
        },
        default: 'pendiente'
    },
    metodoPago: {
        type: String,
        default: 'efectivo',
        trim: true
    }
}, {
    timestamps: true,
});

module.exports = mongoose.model('Pedido', pedidoSchema);
