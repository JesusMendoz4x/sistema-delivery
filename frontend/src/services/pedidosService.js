import api from './api';

/**
 * Crea un nuevo pedido orquestado enviando coordenadas y productos del carrito.
 */
export const crearPedidoReal = async (pedidoData) => {
  const response = await api.post('/pedidos', pedidoData);
  return response.data;
};

/**
 * Obtiene el listado de pedidos realizados por el cliente.
 */
export const getPedidosCliente = async () => {
  const response = await api.get('/pedidos');
  return response.data;
};