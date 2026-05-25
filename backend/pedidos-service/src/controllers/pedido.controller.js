const Pedido = require('../models/Pedido');

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
        res.json(pedido);
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el estado del pedido', error: error.message });
    }
}

exports.asignarRepartidor = async (req, res) => {
    try {
        const { repartidorId } = req.body;
        const pedido = await Pedido.findByIdAndUpdate(
            req.params.id,
            { repartidorId, estado: 'en_camino' }, // al asignar repartidor usualmente cambia el estado
            { new: true, runValidators: true }
        );
        if (!pedido) {
            return res.status(404).json({ message: 'Pedido no encontrado' });
        }
        res.json(pedido);
    } catch (error) {
        res.status(500).json({ message: 'Error al asignar repartidor', error: error.message });
    }
}
