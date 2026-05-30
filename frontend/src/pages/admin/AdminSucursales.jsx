import { useState, useEffect } from "react";
import AdminModal from "../../components/AdminModal";
import { 
  getSucursalesReal, 
  crearSucursalReal, 
  actualizarSucursalReal, 
  desactivarSucursalReal 
} from "../../services/sucursalesService";

function AdminSucursales() {
  const [sucursales, setSucursales] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSucursal, setCurrentSucursal] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSucursales = async ({ showLoader = true } = {}) => {
    if (showLoader) {
      setIsLoading(true);
    }
    try {
      const data = await getSucursalesReal();
      setSucursales(data);
    } catch (error) {
      console.error("Error al obtener sucursales:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchSucursales({ showLoader: false });
    }, 0);

    return () => clearTimeout(timeoutId);
  }, []);

  const handleAdd = () => {
    setCurrentSucursal(null);
    setIsModalOpen(true);
  };

  const handleEdit = (sucursal) => {
    setCurrentSucursal(sucursal);
    setIsModalOpen(true);
  };

  const handleDesactivar = async (id, nombre) => {
    if (window.confirm(`¿Estás seguro de dar de baja la sucursal: ${nombre}?`)) {
      try {
        await desactivarSucursalReal(id);
        await fetchSucursales();
      } catch (error) {
        console.error("Error al desactivar sucursal:", error);
        alert("No se pudo desactivar la sucursal.");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    const payload = {
      nombre: data.nombre,
      ubicacion: {
        latitud: parseFloat(data.latitud),
        longitud: parseFloat(data.longitud)
      },
      capacidadOperativa: parseInt(data.capacidadOperativa, 10),
      direccion: data.direccion || ""
    };

    try {
      if (currentSucursal) {
        await actualizarSucursalReal(currentSucursal._id, payload);
      } else {
        await crearSucursalReal(payload);
      }
      setIsModalOpen(false);
      await fetchSucursales();
    } catch (error) {
      console.error("Error al guardar sucursal:", error);
      alert(error.response?.data?.error || "Error al procesar la operación en MongoDB.");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-[24px] font-['Outfit'] text-[#F2EDE4] tracking-widest uppercase">
          Gestión de Sucursales
        </h2>
        <button 
          onClick={handleAdd}
          className="flex items-center gap-2 bg-[#9B2335] text-white px-6 py-2.5 rounded hover:opacity-80 transition-opacity shadow-[0_4px_14px_rgba(155,35,53,0.4)]"
        >
          <span className="material-symbols-outlined font-light text-[18px]">add_business</span>
          <span className="font-['Nunito'] text-[13px] font-bold tracking-wide">Nueva Sucursal</span>
        </button>
      </div>

      {isLoading ? (
        <div className="text-center text-[#D4AF6A] font-['JetBrains_Mono'] mt-20">
          Cargando red de sucursales en tiempo real...
        </div>
      ) : sucursales.length === 0 ? (
        <div className="text-center text-[#F2EDE4]/40 font-['Nunito'] mt-20">
          No hay sucursales activas registradas en MongoDB.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {sucursales.map((suc) => (
            <div key={suc._id} className="bg-[#141414]/60 border border-[#D4AF6A]/20 p-6 rounded-xl relative group hover:border-[#D4AF6A]/50 hover:-translate-y-1 transition-all duration-300 shadow-[0_8px_30px_rgba(0,0,0,0.4)] backdrop-blur-md">
              
              <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => handleEdit(suc)}
                  className="w-8 h-8 rounded-full bg-[#1a1a1a] border border-[#D4AF6A]/30 flex items-center justify-center text-[#D4AF6A]/70 hover:text-[#D4AF6A] hover:bg-[#D4AF6A]/10 transition-colors shadow-lg"
                >
                  <span className="material-symbols-outlined text-[16px] font-light">edit</span>
                </button>
                <button 
                  onClick={() => handleDesactivar(suc._id, suc.nombre)}
                  className="w-8 h-8 rounded-full bg-[#1a1a1a] border border-[#9B2335]/30 flex items-center justify-center text-[#9B2335]/70 hover:text-[#9B2335] hover:bg-[#9B2335]/10 transition-colors shadow-lg"
                  title="Dar de baja sucursal"
                >
                  <span className="material-symbols-outlined text-[16px] font-light">delete</span>
                </button>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-full bg-[#1a1a1a] border border-[#D4AF6A]/30 flex items-center justify-center text-[#D4AF6A] font-['Outfit'] text-[20px] font-light shadow-inner">
                  <span className="material-symbols-outlined font-light text-[24px]">storefront</span>
                </div>
                <div>
                  <h3 className="font-['Nunito'] text-[#F2EDE4] text-[16px] font-semibold">{suc.nombre}</h3>
                  <p className="font-['Nunito'] text-[#F2EDE4]/50 text-[11px] uppercase tracking-widest">
                    ID: {String(suc._id || '').slice(-6).toUpperCase()}
                  </p>
                </div>
              </div>

              <div className="space-y-3 font-['Nunito'] text-[13px] text-[#F2EDE4]/70 mb-5">
                <p className="line-clamp-2 leading-relaxed">
                  <strong>Dirección:</strong> {suc.direccion || "Sin dirección física registrada."}
                </p>
                <p className="font-['JetBrains_Mono'] text-[11px] text-[#D4AF6A]/70">
                  <strong>Coords:</strong> [{suc.ubicacion?.latitud?.toFixed(4)}, {suc.ubicacion?.longitud?.toFixed(4)}]
                </p>
              </div>

              <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#D4AF6A]/10">
                <div className="flex flex-col gap-1">
                  <span className="font-['JetBrains_Mono'] text-[9px] uppercase tracking-[0.2em] text-[#D4AF6A]/50">Capacidad Operativa</span>
                  <span className="font-['Outfit'] text-[14px] text-[#F2EDE4] font-semibold">
                    {suc.capacidadOperativa} pedidos/hr
                  </span>
                </div>
                <div className="flex flex-col gap-1 items-end">
                  <span className="font-['JetBrains_Mono'] text-[9px] uppercase tracking-[0.2em] text-[#D4AF6A]/50">Estado</span>
                  <span className="px-2 py-0.5 border border-[#D4AF6A]/30 bg-[#D4AF6A]/10 text-[#D4AF6A] rounded-full text-[9px] uppercase tracking-widest font-['JetBrains_Mono']">
                    Activa
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <AdminModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={currentSucursal ? "Editar Sucursal" : "Nueva Sucursal"}
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-[#D4AF6A]/70 font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.2em] mb-2">Nombre de la Sucursal</label>
            <input 
              type="text" 
              name="nombre"
              defaultValue={currentSucursal?.nombre || ""} 
              required 
              className="w-full bg-[#1a1a1a] border border-[#D4AF6A]/20 rounded-lg px-4 py-2.5 text-[#F2EDE4] font-['Nunito'] text-sm focus:outline-none focus:border-[#D4AF6A]/50 transition-colors" 
              placeholder="Ej. Sucursal Reforma"
            />
          </div>
          
          <div>
            <label className="block text-[#D4AF6A]/70 font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.2em] mb-2">Dirección Física</label>
            <input 
              type="text" 
              name="direccion"
              defaultValue={currentSucursal?.direccion || ""} 
              required 
              className="w-full bg-[#1a1a1a] border border-[#D4AF6A]/20 rounded-lg px-4 py-2.5 text-[#F2EDE4] font-['Nunito'] text-sm focus:outline-none focus:border-[#D4AF6A]/50 transition-colors" 
              placeholder="Calle y Número, Colonia, Código Postal"
            />
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="block text-[#D4AF6A]/70 font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.2em] mb-2">Latitud</label>
              <input 
                type="number" 
                step="any"
                name="latitud"
                defaultValue={currentSucursal?.ubicacion?.latitud || ""} 
                required 
                className="w-full bg-[#1a1a1a] border border-[#D4AF6A]/20 rounded-lg px-4 py-2.5 text-[#F2EDE4] font-['Nunito'] text-sm focus:outline-none focus:border-[#D4AF6A]/50 transition-colors" 
                placeholder="Ej. 17.0604"
              />
            </div>
            <div>
              <label className="block text-[#D4AF6A]/70 font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.2em] mb-2">Longitud</label>
              <input 
                type="number" 
                step="any"
                name="longitud"
                defaultValue={currentSucursal?.ubicacion?.longitud || ""} 
                required 
                className="w-full bg-[#1a1a1a] border border-[#D4AF6A]/20 rounded-lg px-4 py-2.5 text-[#F2EDE4] font-['Nunito'] text-sm focus:outline-none focus:border-[#D4AF6A]/50 transition-colors" 
                placeholder="Ej. -96.7266"
              />
            </div>
          </div>

          <div>
            <label className="block text-[#D4AF6A]/70 font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.2em] mb-2">Capacidad Operativa (Pedidos/hr)</label>
            <input 
              type="number" 
              name="capacidadOperativa"
              defaultValue={currentSucursal?.capacidadOperativa || 50} 
              required 
              min="1"
              className="w-full bg-[#1a1a1a] border border-[#D4AF6A]/20 rounded-lg px-4 py-2.5 text-[#F2EDE4] font-['Nunito'] text-sm focus:outline-none focus:border-[#D4AF6A]/50 transition-colors" 
              placeholder="Ej. 50"
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
              {currentSucursal ? "Guardar Cambios" : "Crear Sucursal"}
            </button>
          </div>
        </form>
      </AdminModal>
    </div>
  );
}

export default AdminSucursales;