import api from './api';

/**
 * Obtiene el inventario físico de una sucursal en MongoDB.
 * @param {string} sucursalId ID de la sucursal.
 */
export const getInventarioSucursal = async (sucursalId) => {
  const response = await api.get(`/inventario/sucursal/${sucursalId}`);
  return response.data;
};

/**
 * Actualiza o registra el stock de un producto específico en una sucursal.
 */
export const actualizarStock = async (productoId, sucursalId, stock) => {
  const response = await api.post('/inventario/stock', { productoId, sucursalId, stock });
  return response.data;
};