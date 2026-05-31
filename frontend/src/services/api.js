import axios from 'axios';

// Instancia centralizada de Axios apuntando al puerto del API Gateway
const api = axios.create({
  baseURL: 'http://localhost:5000/api', 
  timeout: 10000,
  headers: {}
});

// Interceptor de peticiones para inyectar automáticamente el token JWT
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
      delete config.headers.common?.['Content-Type'];
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
export const API_BASE_URL = 'http://localhost:5000/api';