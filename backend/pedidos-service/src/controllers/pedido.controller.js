const Pedido = require('../models/Pedido');

// Crear un nuevo pedido
exports.crearPedido = async (req, res) => {
    try {
        const { cliente, productos, estado } = req.body;

        if (!cliente || !productos || productos.length === 0) {
            return res.status(400).json({ message: 'El cliente y los productos son obligatorios' });
        }

        // Calcular el total localmente
        let total = 0;
        for (const prod of productos) {
            if (!prod.precio || !prod.cantidad || prod.cantidad < 1) {
                return res.status(400).json({ message: 'Todos los productos deben incluir precio y cantidad válida' });
            }
            total += prod.precio * prod.cantidad;
        }

        const nuevoPedido = new Pedido({
            cliente,
            productos,
            total,
            estado: estado || 'PENDIENTE'
        });

        await nuevoPedido.save();

        res.status(201).json(nuevoPedido);
    } catch (error) {
        console.error('Error en crearPedido:', error);
        res.status(500).json({ message: 'Error al crear el pedido', error: error.stack });
    }
};

// Listar todos los pedidos con filtros opcionales
exports.listarPedidos = async (req, res) => {
    try {
        const { estado, cliente } = req.query;
        const query = {};

        if (estado) query.estado = estado;
        if (cliente) query['cliente.nombre'] = new RegExp(cliente, 'i');

        const pedidos = await Pedido.find(query).sort({ createdAt: -1 });
        res.json(pedidos);
    } catch (error) {
        res.status(500).json({ message: 'Error al listar los pedidos', error: error.message });
    }
};

// Consultar un pedido por su ID
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
};

// Cambiar el estado de un pedido
exports.actualizarEstadoPedido = async (req, res) => {
    try {
        const { estado } = req.body;
        const pedidoId = req.params.id;

        if (!estado) {
            return res.status(400).json({ message: 'El nuevo estado es obligatorio' });
        }

        const pedido = await Pedido.findById(pedidoId);
        if (!pedido) {
            return res.status(404).json({ message: 'Pedido no encontrado' });
        }

        pedido.estado = estado;
        pedido.historialEstados.push({ estado, fecha: new Date() });

        await pedido.save();
        res.json({
            message: 'Estado del pedido actualizado correctamente',
            pedido
        });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el estado del pedido', error: error.message });
    }
};
