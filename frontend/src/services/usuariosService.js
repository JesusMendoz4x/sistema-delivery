import api from './api';

/**
 * Envía credenciales al microservicio de usuarios para iniciar sesión y obtener JWT.
 * @param {string} email Correo del usuario.
 * @param {string} password Contraseña.
 */
export const loginUsuario = async (email, password) => {
  const response = await api.post('/usuarios/login', { email, password });
  return response.data; // Retorna { ok: true, usuario: {...}, token: "JWT..." }
};

/**
 * Registra un nuevo usuario en la base de datos de Docker a través del Gateway.
 */
export const registrarUsuario = async (datosUsuario) => {
  const response = await api.post('/usuarios', datosUsuario);
  return response.data; // Retorna el usuario creado
};

//FUncion para obtener el listado de usuarios (administradores)
export const getUsuarios = async () => {
  const response = await api.get('/usuarios');
  return response.data;
};

// Funcion para desactivar un usuario (administrador)
export const desactivarUsuario = async (id) => {
  const response = await api.delete(`/usuarios/${id}/desactivar`);
  return response.data;
};

// Funcion para activar un usuario (administrador)
export const activarUsuario = async (id) => {
  const response = await api.put(`/usuarios/${id}/activar`);
  return response.data;
};