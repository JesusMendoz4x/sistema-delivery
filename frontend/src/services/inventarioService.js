// Servicio de Inventario (stock por sucursal).
// Gateway: /api/inventario -> inventario-service
// GET es público; POST requiere rol admin/sucursal (JWT).
import api from "./api";

// ID de la "Sucursal Centro" sembrada por seed.js (stock inicial de 100 u/producto).
export const SUCURSAL_CENTRO_ID = "6650dbf7f1a0b1234567890a";

// Devuelve el inventario de una sucursal con el producto poblado.
export const getInventarioSucursal = async (sucursalId = SUCURSAL_CENTRO_ID) => {
  const { data } = await api.get(`/inventario/sucursal/${sucursalId}`);
  return (Array.isArray(data) ? data : []).map((inv) => ({
    id: inv._id,
    productoId: inv.productoId?._id || inv.productoId,
    producto: inv.productoId?.nombre || "Producto",
    categoria: inv.productoId?.categoria || "general",
    precio: inv.productoId?.precio ?? 0,
    sucursalId: inv.sucursalId,
    stock: inv.stock ?? 0,
  }));
};

// Inicializa o actualiza el stock de un producto en una sucursal (upsert).
export const actualizarStock = async (productoId, stock, sucursalId = SUCURSAL_CENTRO_ID) => {
  const { data } = await api.post("/inventario/stock", {
    productoId,
    sucursalId,
    stock,
  });
  return data;
};
