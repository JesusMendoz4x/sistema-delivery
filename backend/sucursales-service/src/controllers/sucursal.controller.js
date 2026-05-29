const Sucursal = require('../models/Sucursal');

// 1. Crear una nueva sucursal
exports.crearSucursal = async (req, res) => {
    try {
        const { nombre, direccion, ubicacion, capacidadOperativa } = req.body;

        // Validar que todos los campos requeridos estén presentes
        if (!nombre || !direccion || !ubicacion || !ubicacion.latitud || !ubicacion.longitud || !capacidadOperativa) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios' });
        }

        const nuevaSucursal = new Sucursal({
            nombre,
            direccion,
            ubicacion,
            capacidadOperativa,
        });

        const sucursalGuardada = await nuevaSucursal.save();
        res.status(201).json(sucursalGuardada);
    } catch (error) {
        console.error('Error al crear la sucursal:', error);
        res.status(500).json({ error: 'Error al crear la sucursal' });
    }
};

// 2. Listar todas las sucursales
exports.listarSucursales = async (req, res) => {
    try {
        // Obtener solo las sucursales que estan activas
        const sucursales = await Sucursal.find({ estado: true });
        res.status(200).json({
            exito: true,
            cantidad: sucursales.length,
            data: sucursales,
        });
    } catch (error) {
        console.error('Error al listar las sucursales:', error);
        res.status(500).json({ 
            exito: false,
            mensaje: 'Ocurrió un error al listar las sucursales',
            error: error.message,
        });
    }
};

// 3. Obtener una sucursal por ID (GET)
exports.obtenerSucursalPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const sucursal = await Sucursal.findById(id);

        if (!sucursal) {
            return res.status(404).json({ 
                exito: false,
                error: 'Sucursal no encontrada' 
            });
        }

        res.status(200).json({
            exito: true,
            data: sucursal,
        });
    } catch (error) {
        console.error('Error al obtener la sucursal por ID:', error);
        res.status(500).json({ 
            exito: false,
            mensaje: 'Ocurrió un error al obtener la sucursal',
            error: error.message,
        });
    }
};

// 4. Actualizar una sucursal por ID (PUT)
exports.actualizarSucursal = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, direccion, ubicacion, capacidadOperativa, estado } = req.body;

        const sucursalActualizada = await Sucursal.findByIdAndUpdate(
            id,
            { nombre, direccion, ubicacion, capacidadOperativa, estado },
            { new: true, runValidators: true } // new: Devuelve el documento actualizado y runValidators: ejecuta las validaciones del esquema
        );

        if (!sucursalActualizada) {
            return res.status(404).json({ 
                exito: false,
                error: 'Sucursal no encontrada para actualizar' 
            });
        }

        res.status(200).json({
            exito: true,
            mensaje: 'Sucursal actualizada exitosamente',
            data: sucursalActualizada,
        });
    } catch (error) {
        console.error('Error al actualizar la sucursal:', error);
        res.status(500).json({ 
            exito: false,
            mensaje: 'Ocurrió un error al actualizar la sucursal',
            error: error.message,
        });
    }
};

// 5. Desactivar una sucursal por ID (PUT) - En lugar de eliminar, se marca como inactiva
exports.desactivarSucursal = async (req, res) => {
    try {
        const { id } = req.params;

        const sucursalDesactivada = await Sucursal.findByIdAndUpdate(
            id,
            { estado: false }, // Marcar como inactiva en lugar de eliminar
            { new: true }
        );

        if (!sucursalDesactivada) {
            return res.status(404).json({ 
                exito: false,
                error: 'Sucursal no encontrada para desactivar' 
            });
        }

        res.status(200).json({
            exito: true,
            mensaje: 'Sucursal desactivada exitosamente',
            //data: sucursalDesactivada,
        });
    } catch (error) {
        console.error('Error al desactivar la sucursal:', error);
        res.status(500).json({ 
            exito: false,
            mensaje: 'Ocurrió un error al desactivar la sucursal',
            error: error.message,
        });
    }
};