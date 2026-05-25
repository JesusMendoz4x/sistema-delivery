import { useState } from "react";
import AdminModal from "../../components/AdminModal";

function AdminInventario() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);

  const inventario = [
    { id: "INV-001", ingrediente: "Atún Aleta Amarilla", cantidad: 5, unidad: "kg", minimo: 10, estado: "Bajo Stock", categoria: "Pescados" },
    { id: "INV-002", ingrediente: "Arroz de Sushi", cantidad: 50, unidad: "kg", minimo: 15, estado: "Óptimo", categoria: "Abarrotes" },
    { id: "INV-003", ingrediente: "Salsa Soya", cantidad: 12, unidad: "L", minimo: 5, estado: "Óptimo", categoria: "Salsas" },
    { id: "INV-004", ingrediente: "Alga Nori", cantidad: 2, unidad: "paq", minimo: 5, estado: "Crítico", categoria: "Abarrotes" },
    { id: "INV-005", ingrediente: "Edamame", cantidad: 8, unidad: "kg", minimo: 10, estado: "Bajo Stock", categoria: "Vegetales" },
    { id: "INV-006", ingrediente: "Salmón Fresco", cantidad: 25, unidad: "kg", minimo: 8, estado: "Óptimo", categoria: "Pescados" },
  ];

  const getStockColor = (estado) => {
    switch (estado) {
      case "Óptimo": return "text-[#D4AF6A]";
      case "Bajo Stock": return "text-orange-400";
      case "Crítico": return "text-[#9B2335]";
      default: return "text-[#F2EDE4]";
    }
  };

  const handleEdit = (item) => {
    setCurrentItem(item);
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsModalOpen(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-[24px] font-['Outfit'] text-[#F2EDE4] tracking-widest uppercase">
          Gestión de Inventario
        </h2>
        <button 
          onClick={() => { setCurrentItem(null); setIsModalOpen(true); }}
          className="flex items-center gap-2 bg-[#9B2335] text-white px-6 py-2.5 rounded hover:opacity-80 transition-opacity shadow-[0_4px_14px_rgba(155,35,53,0.4)]"
        >
          <span className="material-symbols-outlined font-light text-[18px]">add_box</span>
          <span className="font-['Nunito'] text-[13px] font-bold tracking-wide">Nuevo Ingrediente</span>
        </button>
      </div>

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
              <button className="w-8 h-8 rounded-full bg-[#1a1a1a] border border-[#9B2335]/30 flex items-center justify-center text-[#9B2335]/70 hover:text-[#9B2335] hover:bg-[#9B2335]/10 transition-colors shadow-lg">
                <span className="material-symbols-outlined text-[16px] font-light">delete</span>
              </button>
            </div>

            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="font-['JetBrains_Mono'] text-[#D4AF6A] text-[13px] tracking-wider mb-1">
                  {item.id}
                </h3>
                <p className="font-['JetBrains_Mono'] text-[#F2EDE4]/40 text-[10px] tracking-widest uppercase">
                  {item.categoria}
                </p>
              </div>
            </div>

            <div className="mb-5">
              <p className="font-['Outfit'] text-[#F2EDE4] text-[18px] font-semibold">{item.ingrediente}</p>
            </div>

            <div className="pt-4 border-t border-[#D4AF6A]/10 flex justify-between items-end">
              <div className="flex flex-col gap-1">
                <span className="font-['JetBrains_Mono'] text-[9px] uppercase tracking-[0.2em] text-[#D4AF6A]/50">Stock Actual</span>
                <span className={`font-['Outfit'] text-[24px] font-bold ${getStockColor(item.estado)}`}>
                  {item.cantidad} <span className="text-[12px] font-normal">{item.unidad}</span>
                </span>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="font-['JetBrains_Mono'] text-[9px] uppercase tracking-[0.2em] text-[#D4AF6A]/50">Mínimo</span>
                <span className="font-['JetBrains_Mono'] text-[12px] text-[#F2EDE4]/70">
                  {item.minimo} {item.unidad}
                </span>
              </div>
            </div>

            {item.estado !== "Óptimo" && (
              <div className="mt-4 pt-3 border-t border-dashed border-[#D4AF6A]/10">
                <p className={`font-['JetBrains_Mono'] text-[10px] uppercase tracking-widest flex items-center gap-1 ${getStockColor(item.estado)}`}>
                  <span className="material-symbols-outlined text-[12px]">warning</span>
                  Alerta: {item.estado}
                </p>
              </div>
            )}

          </div>
        ))}
      </div>

      <AdminModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={currentItem ? "Editar Ingrediente" : "Nuevo Ingrediente"}
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-[#D4AF6A]/70 font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.2em] mb-2">Nombre del Ingrediente</label>
            <input 
              type="text" 
              defaultValue={currentItem?.ingrediente || ""} 
              required 
              className="w-full bg-[#1a1a1a] border border-[#D4AF6A]/20 rounded-lg px-4 py-2.5 text-[#F2EDE4] font-['Nunito'] text-sm focus:outline-none focus:border-[#D4AF6A]/50 transition-colors" 
              placeholder="Ej. Salmón Fresco"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="block text-[#D4AF6A]/70 font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.2em] mb-2">Categoría</label>
              <select 
                defaultValue={currentItem?.categoria || ""} 
                required 
                className="w-full bg-[#1a1a1a] border border-[#D4AF6A]/20 rounded-lg px-4 py-2.5 text-[#F2EDE4] font-['Nunito'] text-sm focus:outline-none focus:border-[#D4AF6A]/50 transition-colors appearance-none"
              >
                <option value="Pescados">Pescados y Mariscos</option>
                <option value="Vegetales">Vegetales</option>
                <option value="Abarrotes">Abarrotes</option>
                <option value="Salsas">Salsas y Condimentos</option>
                <option value="Bebidas">Bebidas</option>
              </select>
            </div>
            <div>
              <label className="block text-[#D4AF6A]/70 font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.2em] mb-2">Unidad de Medida</label>
              <select 
                defaultValue={currentItem?.unidad || "kg"} 
                className="w-full bg-[#1a1a1a] border border-[#D4AF6A]/20 rounded-lg px-4 py-2.5 text-[#F2EDE4] font-['Nunito'] text-sm focus:outline-none focus:border-[#D4AF6A]/50 transition-colors appearance-none"
              >
                <option value="kg">Kilogramos (kg)</option>
                <option value="g">Gramos (g)</option>
                <option value="L">Litros (L)</option>
                <option value="ml">Mililitros (ml)</option>
                <option value="paq">Paquetes (paq)</option>
                <option value="pz">Piezas (pz)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="block text-[#D4AF6A]/70 font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.2em] mb-2">Stock Actual</label>
              <input 
                type="number" 
                defaultValue={currentItem?.cantidad || ""} 
                required 
                className="w-full bg-[#1a1a1a] border border-[#D4AF6A]/20 rounded-lg px-4 py-2.5 text-[#F2EDE4] font-['Nunito'] text-sm focus:outline-none focus:border-[#D4AF6A]/50 transition-colors" 
              />
            </div>
            <div>
              <label className="block text-[#D4AF6A]/70 font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.2em] mb-2">Stock Mínimo (Alerta)</label>
              <input 
                type="number" 
                defaultValue={currentItem?.minimo || ""} 
                required 
                className="w-full bg-[#1a1a1a] border border-[#D4AF6A]/20 rounded-lg px-4 py-2.5 text-[#F2EDE4] font-['Nunito'] text-sm focus:outline-none focus:border-[#D4AF6A]/50 transition-colors" 
              />
            </div>
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
              {currentItem ? "Guardar Cambios" : "Añadir al Inventario"}
            </button>
          </div>
        </form>
      </AdminModal>
    </div>
  );
}
export default AdminInventario;
