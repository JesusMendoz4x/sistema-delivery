const axios = require('axios');

/**
 * Realiza una petición HTTP con Axios aplicando reintentos automáticos y un valor de contingencia (fallback).
 * 
 * @param {import('axios').AxiosRequestConfig} axiosConfig Configuración de la petición Axios.
 * @param {number} retries Número máximo de intentos.
 * @param {number} delayMs Tiempo de espera entre reintentos en milisegundos.
 * @param {any} fallbackValue Valor a retornar si todos los intentos fallan.
 * @returns {Promise<any>} Datos de la respuesta del servicio o el valor de contingencia.
 */
async function requestWithRetryAndFallback(axiosConfig, retries = 3, delayMs = 500, fallbackValue) {
    let attempt = 0;
    while (attempt < retries) {
        try {
            console.log(`[ResilientClient] Intentando llamada a ${axiosConfig.url} (Intento ${attempt + 1}/${retries})...`);
            const response = await axios(axiosConfig);
            return response.data;
        } catch (error) {
            attempt++;
            // Determinar si el error es elegible para reintento (error de red o código de estado HTTP 5xx)
            const isNetworkError = !error.response;
            const isServerError = error.response && error.response.status >= 500 && error.response.status < 600;
            const shouldRetry = isNetworkError || isServerError;

            if (!shouldRetry || attempt >= retries) {
                console.error(`[ResilientClient] Error definitivo en llamada a ${axiosConfig.url}. Detalle: ${error.message}`);
                break;
            }

            console.warn(`[ResilientClient] Intento ${attempt} fallido. Reintentando en ${delayMs}ms...`);
            await new Promise(resolve => setTimeout(resolve, delayMs));
        }
    }

    console.warn(`[ResilientClient] [Graceful Degradation] Retornando fallback para la petición fallida a ${axiosConfig.url}`);
    return fallbackValue;
}

module.exports = {
    requestWithRetryAndFallback
};
