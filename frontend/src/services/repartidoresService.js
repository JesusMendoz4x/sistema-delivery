import api from './api';

export const getRepartidores = async () => {
  const response = await api.get('/repartidores');
  return response.data;
};

export const crearRepartidor = async (data) => {
  const response = await api.post('/repartidores', data);
  return response.data;
};

export const activarRepartidor = async (id) => {
  const response = await api.put(`/repartidores/${id}/activar`);
  return response.data;
};