const axios = require('axios');

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

// Calcular la sucursal más cercana basándose en coordenadas dinámicas y reales
exports.obtenerSucursalMasCercana = async (req, res) => {
    try {
        const { latitud, longitud } = req.body;

        if (latitud === undefined || longitud === undefined) {
            return res.status(400).json({ message: 'La latitud y longitud del cliente son requeridas' });
        }

        // URL base del servicio de sucursales (configurable por variable de entorno para local/docker)
        const sucursalesBaseUrl = process.env.SUCURSALES_SERVICE_URL || 'http://localhost:3002';
        const url = `${sucursalesBaseUrl}/api/sucursales`;

        console.log(`[Enrutamiento] Consultando sucursales activas en: ${url}`);

        // Consumir el servicio de sucursales en tiempo real
        const respuesta = await axios.get(url);
        
        // Extraer las sucursales del formato del api de respuesta { exito: true, cantidad: X, data: [...] }
        const sucursales = respuesta.data.data;

        if (!sucursales || !Array.isArray(sucursales) || sucursales.length === 0) {
            return res.status(404).json({ message: 'No se encontraron sucursales activas registradas en el sistema.' });
        }

        let sucursalMasCercana = null;
        let distanciaMinima = Infinity;

        sucursales.forEach(sucursal => {
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

        // Estimación lógica del tiempo de entrega (2 minutos por cada km, con un mínimo de 15 minutos)
        const tiempoEstimadoMinutos = Math.max(15, Math.round(distanciaMinima * 2));

        res.json({
            sucursalId: sucursalMasCercana._id,
            nombre: sucursalMasCercana.nombre,
            distanciaKm: parseFloat(distanciaMinima.toFixed(2)),
            tiempoEstimadoMinutos,
            clienteCoordenadas: { latitud, longitud }
        });

    } catch (error) {
        console.error(`[Error en enrutamiento-service]: ${error.message}`);
        res.status(500).json({ 
            message: 'Error al calcular la sucursal más cercana', 
            error: error.response ? error.response.data : error.message 
        });
    }
};
