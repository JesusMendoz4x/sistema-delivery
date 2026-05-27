const { requestWithRetryAndFallback } = require('./resilientClient');

const INVENTARIO_SERVICE_URL = process.env.INVENTARIO_SERVICE_URL || 'http://localhost:3001';

/**
 * Llama al inventario-service para validar y descontar stock de forma atómica en una sucursal.
 * 
 * @param {string} sucursalId ID de la sucursal seleccionada.
 * @param {Array<{productoId: string, cantidad: number}>} productos Listado de productos solicitados.
 * @param {string} correlationId ID de correlación para seguimiento de logs.
 * @returns {Promise<any>} Resultado de la transacción.
 */
async function validarYDescontarStock(sucursalId, productos, correlationId) {
    const config = {
        method: 'post',
        url: `${INVENTARIO_SERVICE_URL}/api/inventario/validar-y-descontar`,
        headers: {
            'x-correlation-id': correlationId || 'N/A'
        },
        data: {
            sucursalId,
            productos
        },
        timeout: 2000
    };

    // Fallback de contingencia escolar: si el servicio de inventario está fuera de línea,
    // asumimos que hay existencias para mantener el flujo operativo (degradación elegante).
    const fallbackValue = {
        ok: true,
        mensaje: 'Stock asumido como válido de forma automática (inventario-service no disponible).',
        isFallback: true
    };

    return requestWithRetryAndFallback(config, 3, 500, fallbackValue);
}

module.exports = {
    validarYDescontarStock
};
