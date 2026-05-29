import api from './api';

// Obtener todas las sucursales activas desde MongoDB
export const getSucursalesReal = async () => {
  const response = await api.get('/sucursales');
  return response.data.data || []; // El microservicio encapsula el arreglo en .data
};

// Crear una nueva sucursal
export const crearSucursalReal = async (sucursalData) => {
  const response = await api.post('/sucursales', sucursalData);
  return response.data;
};

// Actualizar sucursal existente
export const actualizarSucursalReal = async (id, sucursalData) => {
  const response = await api.put(`/sucursales/${id}`, sucursalData);
  return response.data;
};

// Desactivar sucursal (Soft delete: cambia estado a false en MongoDB)
export const desactivarSucursalReal = async (id) => {
  const response = await api.delete(`/sucursales/${id}`);
  return response.data;
};