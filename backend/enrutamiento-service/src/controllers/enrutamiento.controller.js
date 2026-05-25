// Función auxiliar para calcular la distancia en kilómetros usando la fórmula de Haversine
const calcularDistanciaHaversine = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radio de la Tierra en kilómetros
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    
    const a = 
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
        
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Retorna la distancia en km
};

// Sucursales simuladas en memoria (completamente aisladas y sin peticiones externas)
const SUCURSALES_MEMORIA = [
    {
        _id: '603d2e1a8080808080808080',
        nombre: 'Sucursal Centro',
        ubicacion: { latitud: 19.4326, longitud: -99.1332 },
        capacidadOperativa: 10,
        estado: true
    },
    {
        _id: '603d2e1b8080808080808081',
        nombre: 'Sucursal Norte',
        ubicacion: { latitud: 19.4826, longitud: -99.1332 },
        capacidadOperativa: 5,
        estado: true
    },
    {
        _id: '603d2e1c8080808080808082',
        nombre: 'Sucursal Sur',
        ubicacion: { latitud: 19.3826, longitud: -99.1332 },
        capacidadOperativa: 8,
        estado: true
    }
];

// Calcular la sucursal más cercana basándose en coordenadas del body
exports.obtenerSucursalMasCercana = async (req, res) => {
    try {
        const { latitud, longitud } = req.body;

        if (latitud === undefined || longitud === undefined) {
            return res.status(400).json({ message: 'La latitud y longitud del cliente son requeridas' });
        }

        // Usamos la lista de sucursales en memoria
        const sucursalesActivas = SUCURSALES_MEMORIA.filter(sucursal => sucursal.estado === true);

        if (sucursalesActivas.length === 0) {
            return res.status(404).json({ message: 'No hay sucursales activas registradas' });
        }

        let sucursalMasCercana = null;
        let distanciaMinima = Infinity;

        sucursalesActivas.forEach(sucursal => {
            if (sucursal.ubicacion && sucursal.ubicacion.latitud !== undefined && sucursal.ubicacion.longitud !== undefined) {
                const dist = calcularDistanciaHaversine(
                    latitud,
                    longitud,
                    sucursal.ubicacion.latitud,
                    sucursal.ubicacion.longitud
                );

                if (dist < distanciaMinima) {
                    distanciaMinima = dist;
                    sucursalMasCercana = sucursal;
                }
            }
        });

        if (!sucursalMasCercana) {
            return res.status(404).json({ message: 'No se pudo determinar la sucursal más cercana' });
        }

        res.json({
            sucursalId: sucursalMasCercana._id,
            nombre: sucursalMasCercana.nombre,
            distanciaKm: parseFloat(distanciaMinima.toFixed(2)),
            clienteCoordenadas: { latitud, longitud }
        });

    } catch (error) {
        res.status(500).json({ message: 'Error al calcular la sucursal más cercana', error: error.message });
    }
};
