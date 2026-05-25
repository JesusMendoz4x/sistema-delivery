// Configuración base de la API (Para el equipo de Backend)
// Aquí pueden configurar Axios o Fetch con interceptores para JWT.

/*
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Cambiar por variable de entorno
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' }
});

// Interceptor para inyectar token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
*/

export const API_BASE_URL = 'http://localhost:5000/api';
