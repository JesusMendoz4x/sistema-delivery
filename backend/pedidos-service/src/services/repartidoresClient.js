const { requestWithRetryAndFallback } = require('./resilientClient');

const REPARTIDORES_SERVICE_URL = process.env.REPARTIDORES_SERVICE_URL || 'http://localhost:3004';

/**
 * Consulta la información del repartidor al repartidores-service con políticas de resiliencia.
 * 
 * @param {string} repartidorId ID del repartidor.
 * @returns {Promise<any>} Datos del repartidor o respuesta de contingencia en fallback.
 */
async function verificarRepartidor(repartidorId) {
    const config = {
        method: 'get',
        url: `${REPARTIDORES_SERVICE_URL}/api/repartidores/${repartidorId}`,
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

module.exports = {
    verificarRepartidor
};
