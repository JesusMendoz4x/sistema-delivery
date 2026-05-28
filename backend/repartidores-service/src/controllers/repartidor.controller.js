const Repartidor = require('../models/Repartidor');

exports.crearRepartidor = async (req, res) => {
    try {
        const { nombre, email, telefono, vehiculo, ubicacion, estado } = req.body;
        const nuevoRepartidor = new Repartidor({
            nombre,
            email,
            telefono,
            vehiculo,
            ubicacion,
            estado
        });

        await nuevoRepartidor.save();
        res.status(201).json(nuevoRepartidor);
    } catch (error) {
        res.status(500).json({ message: 'Error al crear el repartidor', error: error.message });
    }
}
exports.listarRepartidores = async (req, res) => {
    try {
        const repartidores = await Repartidor.find().sort({ createdAt: -1 });
        res.json(repartidores);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los repartidores', error: error.message });
    }
}

exports.obtenerRepartidorPorId = async (req, res) => {
    try {
        const repartidor = await Repartidor.findById(req.params.id);
        if (!repartidor) {
            return res.status(404).json({ message: 'Repartidor no encontrado' });
        }
        res.json(repartidor);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el repartidor', error: error.message });
    }
}

exports.actualizarRepartidor = async (req, res) => {

    try {
        const repartidor = await Repartidor.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!repartidor) {
            return res.status(404).json({ message: 'Repartidor no encontrado' });
        }
        res.json(repartidor);
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el repartidor', error: error.message });
    }
}

exports.desactivarRepartidor = async (req, res) => {
    try {
        const repartidor = await Repartidor.findByIdAndUpdate(req.params.id, { estado: 'inactivo' }, {
            new: true,
            runValidators: true
        });
        if (!repartidor) {
            return res.status(404).json({ message: 'Repartidor no encontrado' });
        }
        res.json(repartidor);
    } catch (error) {
        res.status(500).json({ message: 'Error al desactivar el repartidor', error: error.message });
    }
}
exports.activarRepartidor = async (req, res) => {
    try {
        const repartidor = await Repartidor.findByIdAndUpdate(req.params.id, { estado: 'disponible' }, {
            new: true,
            runValidators: true
        });
        if (!repartidor) {
            return res.status(404).json({ message: 'Repartidor no encontrado' });
        }
        res.json(repartidor);
    } catch (error) {
        res.status(500).json({ message: 'Error al activar el repartidor', error: error.message });
    }
}

// Buscar un repartidor con estado 'disponible' y marcarlo como 'en_ruta' de forma atómica
exports.asignarRepartidorDisponible = async (req, res) => {
    try {
        console.log(`[Repartidores Service] [Correlation-ID: ${req.correlationId}] Buscando repartidor disponible...`);
        
        // Buscamos y actualizamos a 'en_ruta' para prevenir condiciones de carrera
        const repartidor = await Repartidor.findOneAndUpdate(
            { estado: 'disponible' },
            { estado: 'en_ruta' },
            { new: true, runValidators: true }
        );

        if (!repartidor) {
            console.log(`[Repartidores Service] [Correlation-ID: ${req.correlationId}] No hay repartidores disponibles en este momento.`);
            return res.json({
                ok: true,
                mensaje: 'No hay repartidores disponibles en este momento.',
                repartidor: null
            });
        }

        console.log(`[Repartidores Service] [Correlation-ID: ${req.correlationId}] Repartidor asignado exitosamente: ${repartidor.nombre} (${repartidor._id})`);
        res.json({
            ok: true,
            mensaje: 'Repartidor asignado con éxito.',
            repartidor
        });
    } catch (error) {
        res.status(500).json({ 
            ok: false, 
            message: 'Error al asignar repartidor disponible', 
            error: error.message 
        });
    }
};

