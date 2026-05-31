// Servicio de Pedidos.
// Gateway: /api/pedidos -> pedidos-service (orquestador).
// TODAS las operaciones requieren JWT (cliente/admin/sucursal).
import api from "./api";

const normalizar = (p) => ({
  id: p._id,
  clienteId: p.clienteId,
  repartidorId: p.repartidorId || null,
  sucursalId: p.sucursalId,
  productos: p.productos || [],
  total: p.total ?? 0,
  direccionEntrega: p.direccionEntrega || "",
  estado: p.estado || "pendiente",
  metodoPago: p.metodoPago || "efectivo",
  createdAt: p.createdAt,
});

export const getPedidos = async () => {
  const { data } = await api.get("/pedidos");
  return Array.isArray(data) ? data.map(normalizar) : [];
};

export const getPedido = async (id) => {
  const { data } = await api.get(`/pedidos/${id}`);
  return normalizar(data);
};

// payload: { clienteId, productos:[{productoId,nombre,precioUnitario,cantidad}],
//            total, direccionEntrega, metodoPago, latitud?, longitud? }
export const crearPedido = async (payload) => {
  const { data } = await api.post("/pedidos", payload);
  return normalizar(data);
};

export const actualizarEstadoPedido = async (id, estado) => {
  const { data } = await api.put(`/pedidos/${id}/estado`, { estado });
  return normalizar(data);
};

export const asignarRepartidor = async (id, repartidorId) => {
  const { data } = await api.put(`/pedidos/${id}/repartidor`, { repartidorId });
  return data;
};
