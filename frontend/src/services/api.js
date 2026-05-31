// Cliente HTTP central del frontend.
// Todas las llamadas salen hacia el API Gateway (http://localhost:5000/api),
// que enruta a cada microservicio y valida el JWT por rol.
import axios from "axios";

export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

// Interceptor de petición: inyecta el token JWT (guardado en el login)
// en la cabecera Authorization para las rutas protegidas del Gateway.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor de respuesta: si el token expiró o es inválido (401),
// limpiamos la sesión para forzar un nuevo login.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
    return Promise.reject(error);
  },
);

export default api;
