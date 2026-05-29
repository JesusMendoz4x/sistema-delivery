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