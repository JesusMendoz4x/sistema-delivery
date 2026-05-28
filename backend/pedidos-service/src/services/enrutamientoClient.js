const { requestWithRetryAndFallback } = require('./resilientClient');

const ENRUTAMIENTO_SERVICE_URL = process.env.ENRUTAMIENTO_SERVICE_URL || 'http://localhost:3006';

/**
 * Registra una nueva ruta de entrega en el enrutamiento-service con políticas de resiliencia.
 * 
 * @param {string} pedidoId ID del pedido.
 * @param {string} repartidorId ID del repartidor asignado.
 * @returns {Promise<any>} Datos de la ruta creada o respuesta de contingencia en fallback.
 */
async function crearRuta(pedidoId, repartidorId, correlationId) {
    const config = {
        method: 'post',
        url: `${ENRUTAMIENTO_SERVICE_URL}/api/rutas`,
        headers: {
            'x-correlation-id': correlationId || 'N/A'
        },
        data: {
            repartidorId,
            pedidos: [pedidoId],
            distanciaEstimadaKm: 4.5, // Distancia por defecto
            tiempoEstimadoMinutos: 15 // Tiempo estimado por defecto
        },
        timeout: 2000
    };

    // Valor de fallback si el servicio de enrutamiento no responde
    const fallbackValue = {
        _id: 'fallback-ruta-' + Date.now(),
        repartidorId,
        pedidos: [pedidoId],
        distanciaEstimadaKm: 0,
        tiempoEstimadoMinutos: 0,
        estado: 'asignada',
        isFallback: true,
        message: 'Ruta de contingencia (enrutamiento-service no disponible)'
    };

    return requestWithRetryAndFallback(config, 3, 500, fallbackValue);
}

/**
 * Calcula la sucursal más cercana basada en la latitud y longitud del cliente.
 * 
 * @param {number} latitud Latitud del cliente.
 * @param {number} longitud Longitud del cliente.
 * @param {string} correlationId ID de correlación.
 * @returns {Promise<any>} Datos de la sucursal más cercana (ID, nombre, distancia, tiempo estimado).
 */
async function obtenerSucursalMasCercana(latitud, longitud, correlationId) {
    const config = {
        method: 'post',
        url: `${ENRUTAMIENTO_SERVICE_URL}/api/enrutamiento/calcular-cercana`,
        headers: {
            'x-correlation-id': correlationId || 'N/A'
        },
        data: {
            latitud,
            longitud
        },
        timeout: 2000
    };

    // Fallback de contingencia: si el servicio de enrutamiento no responde,
    // le asignamos la Sucursal Centro (ID semilla) con valores estándar.
    const fallbackValue = {
        sucursalId: '6650dbf7f1a0b1234567890a', // ID fijo semilla de Sucursal Centro
        nombre: 'Sucursal Centro (Fallback de Contingencia)',
        distanciaKm: 5.0,
        tiempoEstimadoMinutos: 20,
        isFallback: true
    };

    return requestWithRetryAndFallback(config, 3, 500, fallbackValue);
}

module.exports = {
    crearRuta,
    obtenerSucursalMasCercana
};

