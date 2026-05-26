const { requestWithRetryAndFallback } = require('./resilientClient');

const ENRUTAMIENTO_SERVICE_URL = process.env.ENRUTAMIENTO_SERVICE_URL || 'http://localhost:3006';

/**
 * Registra una nueva ruta de entrega en el enrutamiento-service con políticas de resiliencia.
 * 
 * @param {string} pedidoId ID del pedido.
 * @param {string} repartidorId ID del repartidor asignado.
 * @returns {Promise<any>} Datos de la ruta creada o respuesta de contingencia en fallback.
 */
async function crearRuta(pedidoId, repartidorId) {
    const config = {
        method: 'post',
        url: `${ENRUTAMIENTO_SERVICE_URL}/api/rutas`,
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

module.exports = {
    crearRuta
};
