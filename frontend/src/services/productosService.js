// Servicio de Productos (catálogo maestro).
// Gateway: /api/productos  ->  inventario-service /api/inventario
// GET es público; POST/PUT/DELETE requieren rol admin/sucursal (JWT).
import api from "./api";

// Normaliza el documento de Mongo (_id) a una forma estable para la UI (id).
const normalizar = (p) => ({
  id: p._id,
  nombre: p.nombre,
  descripcion: p.descripcion || "",
  categoria: p.categoria || "general",
  precio: typeof p.precio === "number" ? p.precio : parseFloat(p.precio) || 0,
  disponible: p.disponible !== false,
});

export const getProductos = async () => {
  const { data } = await api.get("/productos");
  return Array.isArray(data) ? data.map(normalizar) : [];
};

export const getProducto = async (id) => {
  const { data } = await api.get(`/productos/${id}`);
  return normalizar(data);
};

export const createProducto = async (payload) => {
  const { data } = await api.post("/productos", payload);
  return normalizar(data);
};

export const updateProducto = async (id, payload) => {
  const { data } = await api.put(`/productos/${id}`, payload);
  return normalizar(data);
};

export const deleteProducto = async (id) => {
  await api.delete(`/productos/${id}`);
  return true;
};
