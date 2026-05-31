import { useState, useEffect } from "react";
import AdminModal from "../../components/AdminModal";
import {
  getInventarioSucursal,
  actualizarStock,
  SUCURSAL_CENTRO_ID,
} from "../../services/inventarioService";
import { getProductos } from "../../services/productosService";

// Umbral para marcar "stock bajo" en la UI (no existe en el backend, es solo visual).
const STOCK_MINIMO = 10;

function AdminInventario() {
  const [inventario, setInventario] = useState([]);
  const [productos, setProductos] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [current, setCurrent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = async () => {
    try {
      const [inv, prods] = await Promise.all([
        getInventarioSucursal(SUCURSAL_CENTRO_ID),
        getProductos().catch(() => []),
      ]);
      setInventario(inv);
      setProductos(prods);
      setError("");
    } catch (err) {
      console.error("Error al cargar inventario", err);
      setError("No se pudo cargar el inventario de la sucursal.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getStockColor = (stock) => {
    if (stock <= 0) return "text-[#9B2335]";
    if (stock < STOCK_MINIMO) return "text-orange-400";
    return "text-[#D4AF6A]";
  };

  const getEstadoTexto = (stock) => {
    if (stock <= 0) return "Agotado";
    if (stock < STOCK_MINIMO) return "Bajo Stock";
    return "Óptimo";
  };

  const handleEdit = (item) => {
    setCurrent(item);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const productoId = current ? current.productoId : formData.get("productoId");
    const stock = parseInt(formData.get("stock"), 10);

    if (!productoId || Number.isNaN(stock)) {
      window.alert("Selecciona un producto e indica una cantidad válida.");
      return;
    }

    try {
      await actualizarStock(productoId, stock, SUCURSAL_CENTRO_ID);
      setIsModalOpen(false);
      await fetchData();
    } catch (err) {
      console.error("Error al actualizar stock", err);
      window.alert(
        err.response?.data?.message || "No se pudo actualizar el stock.",
      );
    }
  };

  // Productos que aún no tienen registro de stock en esta sucursal.
  const productosSinStock = productos.filter(
    (p) => !inventario.some((inv) => inv.productoId === p.id),
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-[24px] font-['Outfit'] text-[#F2EDE4] tracking-widest uppercase">
          Inventario por Sucursal
        </h2>
        <button
          onClick={() => { setCurrent(null); setIsModalOpen(true); }}
          className="flex items-center gap-2 bg-[#9B2335] text-white px-6 py-2.5 rounded hover:opacity-80 transition-opacity shadow-[0_4px_14px_rgba(155,35,53,0.4)]"
        >
          <span className="material-symbols-outlined font-light text-[18px]">add_box</span>
          <span className="font-['Nunito'] text-[13px] font-bold tracking-wide">Asignar Stock</span>
        </button>
      </div>
      <p className="font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.2em] text-[#D4AF6A]/50 mb-10">
        Sucursal Centro · {SUCURSAL_CENTRO_ID}
      </p>

      {error && (
        <div className="mb-6 text-[#E57474] font-['JetBrains_Mono'] text-[12px] uppercase tracking-widest">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="text-center text-[#D4AF6A] font-['JetBrains_Mono'] mt-20">Cargando inventario...</div>
      ) : inventario.length === 0 ? (
        <div className="text-center text-[#F2EDE4]/40 font-['Nunito'] mt-20">
          No hay stock registrado en esta sucursal. Usa "Asignar Stock".
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {inventario.map((item) => (
            <div key={item.id} className="bg-[#141414]/60 border border-[#D4AF6A]/20 p-6 rounded-xl relative group hover:border-[#D4AF6A]/50 hover:-translate-y-1 transition-all duration-300 shadow-[0_8px_30px_rgba(0,0,0,0.4)] backdrop-blur-md">

              <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleEdit(item)}
                  className="w-8 h-8 rounded-full bg-[#1a1a1a] border border-[#D4AF6A]/30 flex items-center justify-center text-[#D4AF6A]/70 hover:text-[#D4AF6A] hover:bg-[#D4AF6A]/10 transition-colors shadow-lg"
                >
                  <span className="material-symbols-outlined text-[16px] font-light">edit</span>
                </button>
              </div>

              <div className="mb-5">
                <p className="font-['JetBrains_Mono'] text-[#F2EDE4]/40 text-[10px] tracking-widest uppercase mb-1">{item.categoria}</p>
                <p className="font-['Outfit'] text-[#F2EDE4] text-[18px] font-semibold">{item.producto}</p>
              </div>

              <div className="pt-4 border-t border-[#D4AF6A]/10 flex justify-between items-end">
                <div className="flex flex-col gap-1">
                  <span className="font-['JetBrains_Mono'] text-[9px] uppercase tracking-[0.2em] text-[#D4AF6A]/50">Stock Actual</span>
                  <span className={`font-['Outfit'] text-[24px] font-bold ${getStockColor(item.stock)}`}>
                    {item.stock} <span className="text-[12px] font-normal">u</span>
                  </span>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="font-['JetBrains_Mono'] text-[9px] uppercase tracking-[0.2em] text-[#D4AF6A]/50">Estado</span>
                  <span className={`font-['JetBrains_Mono'] text-[11px] ${getStockColor(item.stock)}`}>
                    {getEstadoTexto(item.stock)}
                  </span>
                </div>
              </div>

              {item.stock < STOCK_MINIMO && (
                <div className="mt-4 pt-3 border-t border-dashed border-[#D4AF6A]/10">
                  <p className={`font-['JetBrains_Mono'] text-[10px] uppercase tracking-widest flex items-center gap-1 ${getStockColor(item.stock)}`}>
                    <span className="material-symbols-outlined text-[12px]">warning</span>
                    Alerta: {getEstadoTexto(item.stock)}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <AdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={current ? `Ajustar Stock · ${current.producto}` : "Asignar Stock a Producto"}
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          {!current && (
            <div>
              <label className="block text-[#D4AF6A]/70 font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.2em] mb-2">Producto</label>
              <select
                name="productoId"
                required
                defaultValue=""
                className="w-full bg-[#1a1a1a] border border-[#D4AF6A]/20 rounded-lg px-4 py-2.5 text-[#F2EDE4] font-['Nunito'] text-sm focus:outline-none focus:border-[#D4AF6A]/50 transition-colors appearance-none"
              >
                <option value="" disabled>Seleccionar producto...</option>
                {productosSinStock.map((p) => (
                  <option key={p.id} value={p.id}>{p.nombre}</option>
                ))}
              </select>
              {productosSinStock.length === 0 && (
                <p className="mt-2 text-[#F2EDE4]/40 font-['Nunito'] text-xs">
                  Todos los productos ya tienen stock asignado en esta sucursal.
                </p>
              )}
            </div>
          )}

          <div>
            <label className="block text-[#D4AF6A]/70 font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.2em] mb-2">Stock (unidades)</label>
            <input
              type="number"
              name="stock"
              min="0"
              defaultValue={current?.stock ?? ""}
              required
              className="w-full bg-[#1a1a1a] border border-[#D4AF6A]/20 rounded-lg px-4 py-2.5 text-[#F2EDE4] font-['Nunito'] text-sm focus:outline-none focus:border-[#D4AF6A]/50 transition-colors"
              placeholder="Ej. 100"
            />
          </div>

          <div className="pt-6 mt-6 flex justify-end gap-3 border-t border-[#D4AF6A]/10">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-5 py-2.5 rounded-lg font-['Nunito'] text-[13px] text-[#F2EDE4]/70 hover:bg-[#F2EDE4]/10 hover:text-[#F2EDE4] transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-[#D4AF6A] text-[#101010] px-6 py-2.5 rounded-lg font-['Nunito'] text-[13px] font-bold hover:opacity-90 transition-opacity shadow-[0_4px_14px_rgba(212,175,106,0.3)]"
            >
              {current ? "Guardar Stock" : "Asignar Stock"}
            </button>
          </div>
        </form>
      </AdminModal>
    </div>
  );
}
export default AdminInventario;
