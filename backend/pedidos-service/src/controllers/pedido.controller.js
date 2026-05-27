const Pedido = require('../models/Pedido');
const { verificarRepartidor } = require('../services/repartidoresClient');
const { crearRuta } = require('../services/enrutamientoClient');
const axios = require('axios');

const API_GATEWAY_URL = process.env.API_GATEWAY_URL || 'http://api-gateway:5000';

const notificarCambioEstado = async (pedidoId, datos) => {
    try {
        console.log(`[Pedidos] Notificando cambio de estado para pedido ${pedidoId} al API Gateway...`);
        await axios.post(`${API_GATEWAY_URL}/api-internal/pedido-update`, {
            pedidoId,
            ...datos
        }, { timeout: 1500 });
    } catch (error) {
        console.warn(`[Pedidos] Advertencia: No se pudo notificar cambio de estado a través de WebSockets: ${error.message}`);
    }
};

exports.crearPedido = async (req, res) => {
    try {
        const { clienteId, sucursalId, productos, total, direccionEntrega, metodoPago } = req.body;
        const nuevoPedido = new Pedido({
            clienteId,
            sucursalId,
            productos,
            total,
            direccionEntrega,
            metodoPago
        });

        await nuevoPedido.save();
        res.status(201).json(nuevoPedido);
    } catch (error) {
        res.status(500).json({ message: 'Error al crear el pedido', error: error.message });
    }
}

exports.listarPedidos = async (req, res) => {
    try {
        const pedidos = await Pedido.find().sort({ createdAt: -1 });
        res.json(pedidos);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los pedidos', error: error.message });
    }
}

exports.obtenerPedidoPorId = async (req, res) => {
    try {
        const pedido = await Pedido.findById(req.params.id);
        if (!pedido) {
            return res.status(404).json({ message: 'Pedido no encontrado' });
        }
        res.json(pedido);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el pedido', error: error.message });
    }
}

exports.actualizarEstadoPedido = async (req, res) => {
    try {
        const { estado } = req.body;
        const pedido = await Pedido.findByIdAndUpdate(
            req.params.id, 
            { estado }, 
            { new: true, runValidators: true }
        );
        if (!pedido) {
            return res.status(404).json({ message: 'Pedido no encontrado' });
        }
        
        // Notificar en segundo plano (no bloquea la respuesta HTTP)
        notificarCambioEstado(pedido._id, { estado: pedido.estado, repartidorId: pedido.repartidorId });
        
        res.json(pedido);
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el estado del pedido', error: error.message });
    }
}

exports.asignarRepartidor = async (req, res) => {
    try {
        const { repartidorId } = req.body;

        // Primero verificamos que el pedido exista
        const pedidoExistente = await Pedido.findById(req.params.id);
        if (!pedidoExistente) {
            return res.status(404).json({ message: 'Pedido no encontrado' });
        }

        // 1. Verificar repartidor (Resiliente, con fallback de contingencia)
        console.log(`[Pedidos] [Correlation-ID: ${req.correlationId}] Solicitando verificación de repartidor ${repartidorId}...`);
        const infoRepartidor = await verificarRepartidor(repartidorId, req.correlationId);

        // 2. Calcular y registrar ruta (Resiliente, con fallback de contingencia)
        console.log(`[Pedidos] [Correlation-ID: ${req.correlationId}] Solicitando creación de ruta para pedido ${req.params.id} con repartidor ${repartidorId}...`);
        const infoRuta = await crearRuta(req.params.id, repartidorId, req.correlationId);

        // 3. Actualizar el pedido localmente
        const pedido = await Pedido.findByIdAndUpdate(
            req.params.id,
            { repartidorId, estado: 'en_camino' },
            { new: true, runValidators: true }
        );

        // Notificar en segundo plano al Gateway para emitir por WebSockets
        notificarCambioEstado(pedido._id, { 
            estado: pedido.estado, 
            repartidorId: pedido.repartidorId,
            ruta: infoRuta
        });

        res.json({
            message: 'Repartidor asignado con éxito',
            pedido,
            repartidor: infoRepartidor,
            ruta: infoRuta
        });
    } catch (error) {
        res.status(500).json({ message: 'Error al asignar repartidor', error: error.message });
    }
}
