import { useState, useEffect } from "react";
import AdminModal from "../../components/AdminModal";
import api from "../../services/api";
import { getInventarioSucursal, actualizarStock } from "../../services/inventarioService";

function AdminInventario() {
  const [sucursales, setSucursales] = useState([]);
  const [selectedSucursalId, setSelectedSucursalId] = useState("");
  const [inventario, setInventario] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // 1. Consultar el listado de sucursales reales de MongoDB al montar el panel
  useEffect(() => {
    const fetchSucursales = async () => {
      try {
        const response = await api.get("/sucursales");
        // El microservicio encapsula el arreglo en response.data.data
        const listaSucursales = response.data.data || [];
        setSucursales(listaSucursales);
        
        // Seleccionamos la primera por defecto si existen
        if (listaSucursales.length > 0) {
          setSelectedSucursalId(listaSucursales[0]._id);
        }
      } catch (error) {
        console.error("Error al obtener la lista de sucursales:", error);
      }
    };
    fetchSucursales();
  }, []);

  // 2. Consultar el stock físico real cada vez que el usuario cambie la sucursal seleccionada
  useEffect(() => {
    if (!selectedSucursalId) return;

    const fetchInventario = async () => {
      setIsLoading(true);
      try {
        const data = await getInventarioSucursal(selectedSucursalId);
        setInventario(data);
      } catch (error) {
        console.error("Error al cargar el inventario físico:", error);
        setInventario([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchInventario();
  }, [selectedSucursalId]);

  const getStockColor = (stock) => {
    if (stock <= 5) return "text-[#9B2335]"; // Crítico
    if (stock <= 20) return "text-orange-400"; // Bajo Stock
    return "text-[#D4AF6A]"; // Óptimo
  };

  const getStockStatus = (stock) => {
    if (stock <= 5) return "Crítico";
    if (stock <= 20) return "Bajo Stock";
    return "Óptimo";
  };

  const handleEdit = (item) => {
    setCurrentItem(item);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const stockValue = parseInt(e.target.elements.stock.value, 10);

    if (currentItem && !isNaN(stockValue) && selectedSucursalId) {
      try {
        const prodId = currentItem.productoId?._id || currentItem.productoId;
        
        // Actualizamos en la base de datos real a través del API Gateway
        await actualizarStock(prodId, selectedSucursalId, stockValue);
        
        setIsModalOpen(false);
        
        // Refrescamos inmediatamente para pintar el nuevo número
        const data = await getInventarioSucursal(selectedSucursalId);
        setInventario(data);
      } catch (error) {
        console.error("Error al actualizar existencias de stock:", error);
        alert("No se pudo actualizar el stock en la base de datos.");
      }
    }
  };

  return (
    <div>
      {/* Encabezado dinámico con selector de Sucursales reales de MongoDB */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
        <h2 className="text-[24px] font-['Outfit'] text-[#F2EDE4] tracking-widest uppercase">
          Gestión de Inventario Real
        </h2>
        
        <div className="flex items-center gap-3 bg-[#141414]/40 border border-[#D4AF6A]/20 px-4 py-2 rounded-lg backdrop-blur-md">
          <span className="font-['JetBrains_Mono'] text-[10px] text-[#D4AF6A] uppercase tracking-[0.2em]">
            Sucursal:
          </span>
          <select 
            value={selectedSucursalId} 
            onChange={(e) => setSelectedSucursalId(e.target.value)}
            className="bg-transparent border-none text-[#F2EDE4] font-['Nunito'] text-sm focus:outline-none cursor-pointer pr-4"
          >
            {sucursales.map(suc => (
              <option key={suc._id} value={suc._id} className="bg-[#101010] text-[#F2EDE4]">
                {suc.nombre}
              </option>
            ))}
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center text-[#D4AF6A] font-['JetBrains_Mono'] mt-20">
          Cargando existencias en tiempo real...
        </div>
      ) : inventario.length === 0 ? (
        <div className="text-center text-[#F2EDE4]/40 font-['Nunito'] mt-20">
          No hay productos asignados al inventario de esta sucursal en MongoDB.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {inventario.map((item) => {
            const prod = item.productoId || {};
            const estado = getStockStatus(item.stock);
            
            return (
              <div key={item._id} className="bg-[#141414]/60 border border-[#D4AF6A]/20 p-6 rounded-xl relative group hover:border-[#D4AF6A]/50 hover:-translate-y-1 transition-all duration-300 shadow-[0_8px_30px_rgba(0,0,0,0.4)] backdrop-blur-md">
                
                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => handleEdit(item)}
                    className="w-8 h-8 rounded-full bg-[#1a1a1a] border border-[#D4AF6A]/30 flex items-center justify-center text-[#D4AF6A]/70 hover:text-[#D4AF6A] hover:bg-[#D4AF6A]/10 transition-colors shadow-lg"
                  >
                    <span className="material-symbols-outlined text-[16px] font-light">edit</span>
                  </button>
                </div>

                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="font-['JetBrains_Mono'] text-[#D4AF6A] text-[13px] tracking-wider mb-1">
                      {prod._id ? `PROD-${String(prod._id).slice(-6).toUpperCase()}` : "REF-GEN"}
                    </h3>
                    <p className="font-['JetBrains_Mono'] text-[#F2EDE4]/40 text-[10px] tracking-widest uppercase">
                      {prod.categoria || "Menú"}
                    </p>
                  </div>
                </div>

                <div className="mb-5">
                  <p className="font-['Outfit'] text-[#F2EDE4] text-[18px] font-semibold">
                    {prod.nombre || "Platillo Casablanca"}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#D4AF6A]/10 flex justify-between items-end">
                  <div className="flex flex-col gap-1">
                    <span className="font-['JetBrains_Mono'] text-[9px] uppercase tracking-[0.2em] text-[#D4AF6A]/50">Stock Actual</span>
                    <span className={`font-['Outfit'] text-[24px] font-bold ${getStockColor(item.stock)}`}>
                      {item.stock} <span className="text-[12px] font-normal">unidades</span>
                    </span>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="font-['JetBrains_Mono'] text-[9px] uppercase tracking-[0.2em] text-[#D4AF6A]/50">Mínimo Alerta</span>
                    <span className="font-['JetBrains_Mono'] text-[12px] text-[#F2EDE4]/70">
                      20 unidades
                    </span>
                  </div>
                </div>

                {estado !== "Óptimo" && (
                  <div className="mt-4 pt-3 border-t border-dashed border-[#D4AF6A]/10">
                    <p className={`font-['JetBrains_Mono'] text-[10px] uppercase tracking-widest flex items-center gap-1 ${getStockColor(item.stock)}`}>
                      <span className="material-symbols-outlined text-[12px]">warning</span>
                      Alerta: {estado}
                    </p>
                  </div>
                )}

              </div>
            );
          })}
        </div>
      )}

      {/* Modal para editar stock físico real */}
      <AdminModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title="Actualizar existencias en MongoDB"
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-[#D4AF6A]/70 font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.2em] mb-2">
              Producto Seleccionado
            </label>
            <input 
              type="text" 
              disabled
              value={currentItem?.productoId?.nombre || ""} 
              className="w-full bg-[#141414] border border-[#D4AF6A]/10 rounded-lg px-4 py-2.5 text-[#F2EDE4]/60 font-['Nunito'] text-sm outline-none cursor-not-allowed" 
            />
          </div>

          <div>
            <label className="block text-[#D4AF6A]/70 font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.2em] mb-2">
              Inventario en Sucursal (Unidades)
            </label>
            <input 
              type="number" 
              name="stock"
              defaultValue={currentItem?.stock ?? 0} 
              required 
              min="0"
              className="w-full bg-[#1a1a1a] border border-[#D4AF6A]/20 rounded-lg px-4 py-2.5 text-[#F2EDE4] font-['Nunito'] text-sm focus:outline-none focus:border-[#D4AF6A]/50 transition-colors" 
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
              Guardar Cambios
            </button>
          </div>
        </form>
      </AdminModal>
    </div>
  );
}

export default AdminInventario;
