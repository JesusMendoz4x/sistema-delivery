// Servicio de Usuarios / Autenticación.
// Gateway: /api/usuarios -> usuario-service
// POST (login/registro) es público; el resto requiere rol admin (JWT).
import api from "./api";

const normalizar = (u) => ({
  id: u._id,
  nombre: u.nombre,
  email: u.email,
  telefono: u.telefono || "",
  direccion: u.direccion || "",
  rol: u.rol || "cliente",
  estado: u.estado || "activo",
});

// Login: devuelve { ok, usuario, token } desde el backend.
export const login = async (email, password) => {
  const { data } = await api.post("/usuarios/login", { email, password });
  return data;
};

export const getUsuarios = async () => {
  const { data } = await api.get("/usuarios");
  return Array.isArray(data) ? data.map(normalizar) : [];
};

export const createUsuario = async (payload) => {
  const { data } = await api.post("/usuarios", payload);
  return normalizar(data);
};

export const updateUsuario = async (id, payload) => {
  const { data } = await api.put(`/usuarios/${id}`, payload);
  return normalizar(data);
};

export const desactivarUsuario = async (id) => {
  const { data } = await api.delete(`/usuarios/${id}/desactivar`);
  return normalizar(data);
};

export const activarUsuario = async (id) => {
  const { data } = await api.put(`/usuarios/${id}/activar`, {});
  return normalizar(data);
};
