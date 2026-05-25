const Ruta = require('../models/Ruta');

exports.crearRuta = async (req, res) => {
    try {
        const { repartidorId, pedidos, distanciaEstimadaKm, tiempoEstimadoMinutos } = req.body;
        const nuevaRuta = new Ruta({
            repartidorId,
            pedidos,
            distanciaEstimadaKm,
            tiempoEstimadoMinutos
        });

        await nuevaRuta.save();
        res.status(201).json(nuevaRuta);
    } catch (error) {
        res.status(500).json({ message: 'Error al crear la ruta', error: error.message });
    }
}

exports.listarRutas = async (req, res) => {
    try {
        const { repartidorId, estado } = req.query;
        let filtro = {};
        if (repartidorId) filtro.repartidorId = repartidorId;
        if (estado) filtro.estado = estado;

        const rutas = await Ruta.find(filtro).sort({ createdAt: -1 });
        res.json(rutas);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener las rutas', error: error.message });
    }
}

exports.obtenerRutaPorId = async (req, res) => {
    try {
        const ruta = await Ruta.findById(req.params.id);
        if (!ruta) {
            return res.status(404).json({ message: 'Ruta no encontrada' });
        }
        res.json(ruta);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener la ruta', error: error.message });
    }
}

exports.actualizarEstadoRuta = async (req, res) => {
    try {
        const { estado } = req.body;
        const ruta = await Ruta.findByIdAndUpdate(
            req.params.id, 
            { estado }, 
            { new: true, runValidators: true }
        );
        if (!ruta) {
            return res.status(404).json({ message: 'Ruta no encontrada' });
        }
        res.json(ruta);
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el estado de la ruta', error: error.message });
    }
}

exports.actualizarUbicacionRuta = async (req, res) => {
    try {
        const { latitud, longitud } = req.body;
        const ruta = await Ruta.findByIdAndUpdate(
            req.params.id,
            { 'ubicacionActual.latitud': latitud, 'ubicacionActual.longitud': longitud },
            { new: true, runValidators: true }
        );
        if (!ruta) {
            return res.status(404).json({ message: 'Ruta no encontrada' });
        }
        res.json(ruta);
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar la ubicación de la ruta', error: error.message });
    }
}
