// Servicio de Repartidores.
// Gateway: /api/repartidores -> repartidores-service
// GET es público; POST/PUT/DELETE requieren rol admin (JWT).
import api from "./api";

const normalizar = (r) => ({
  id: r._id,
  nombre: r.nombre,
  email: r.email || "",
  telefono: r.telefono || "",
  vehiculo: r.vehiculo || { tipo: "motocicleta", placa: "" },
  ubicacion: r.ubicacion || { latitud: 0, longitud: 0 },
  capacidadOperativa: r.capacidadOperativa ?? 3,
  estado: r.estado || "disponible",
});

export const getRepartidores = async () => {
  const { data } = await api.get("/repartidores");
  return Array.isArray(data) ? data.map(normalizar) : [];
};

export const createRepartidor = async (payload) => {
  const { data } = await api.post("/repartidores", payload);
  return normalizar(data);
};

export const updateRepartidor = async (id, payload) => {
  const { data } = await api.put(`/repartidores/${id}`, payload);
  return normalizar(data);
};

export const desactivarRepartidor = async (id) => {
  const { data } = await api.delete(`/repartidores/${id}/desactivar`);
  return normalizar(data);
};

export const activarRepartidor = async (id) => {
  const { data } = await api.put(`/repartidores/${id}/activar`, {});
  return normalizar(data);
};
