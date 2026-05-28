const { requestWithRetryAndFallback } = require('./resilientClient');

const REPARTIDORES_SERVICE_URL = process.env.REPARTIDORES_SERVICE_URL || 'http://localhost:3004';

/**
 * Consulta la información del repartidor al repartidores-service con políticas de resiliencia.
 * 
 * @param {string} repartidorId ID del repartidor.
 * @returns {Promise<any>} Datos del repartidor o respuesta de contingencia en fallback.
 */
async function verificarRepartidor(repartidorId, correlationId) {
    const config = {
        method: 'get',
        url: `${REPARTIDORES_SERVICE_URL}/api/repartidores/${repartidorId}`,
        headers: {
            'x-correlation-id': correlationId || 'N/A'
        },
        timeout: 2000 // Timeout corto para no retener la petición demasiado tiempo
    };

    // Valor de fallback si el servicio de repartidores no responde
    const fallbackValue = {
        _id: repartidorId,
        nombre: 'Repartidor de Contingencia',
        telefono: '000-000-000',
        vehiculo: 'Moto (Genérico)',
        estado: 'activo',
        isFallback: true
    };

    return requestWithRetryAndFallback(config, 3, 500, fallbackValue);
}

/**
 * Solicita la asignación automática de un repartidor disponible.
 * 
 * @param {string} correlationId ID de correlación.
 * @returns {Promise<any>} Datos del repartidor asignado o null en su defecto.
 */
async function asignarRepartidorDisponible(correlationId) {
    const config = {
        method: 'post',
        url: `${REPARTIDORES_SERVICE_URL}/api/repartidores/asignar`,
        headers: {
            'x-correlation-id': correlationId || 'N/A'
        },
        timeout: 2000
    };

    // Fallback de contingencia: si el servicio de repartidores está caído,
    // asumimos que el pedido queda pendiente de asignación manual sin detener la compra.
    const fallbackValue = {
        ok: true,
        mensaje: 'Asignación diferida (repartidores-service no disponible).',
        repartidor: null,
        isFallback: true
    };

    return requestWithRetryAndFallback(config, 3, 500, fallbackValue);
}

module.exports = {
    verificarRepartidor,
    asignarRepartidorDisponible
};

