import { useState } from "react";
import AdminModal from "../../components/AdminModal";

function AdminProductos() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);

  const productos = [
    { id: 1, nombre: "Tonkotsu Ramen", precio: 180.00, categoria: "Plato Principal", icono: "ramen_dining", destacado: true },
    { id: 2, nombre: "Gyoza de Wagyu", precio: 124.00, categoria: "Entradas", icono: "set_meal", destacado: true },
    { id: 3, nombre: "Nigiri de Toro", precio: 95.00, categoria: "Sushi", icono: "restaurant", destacado: false },
    { id: 4, nombre: "Edamames al Vapor", precio: 65.00, categoria: "Entradas", icono: "eco", destacado: false },
    { id: 5, nombre: "Mochi de Matcha", precio: 85.00, categoria: "Postres", icono: "icecream", destacado: false },
    { id: 6, nombre: "Sashimi Mixto", precio: 220.00, categoria: "Sushi", icono: "set_meal", destacado: true },
  ];

  const handleAdd = () => {
    setCurrentProduct(null);
    setIsModalOpen(true);
  };

  const handleEdit = (prod) => {
    setCurrentProduct(prod);
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsModalOpen(false);
    // Simular guardado exitoso (para desarrollo)
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-[24px] font-['Outfit'] text-[#F2EDE4] tracking-widest uppercase">
          Catálogo de Productos
        </h2>
        <button 
          onClick={handleAdd}
          className="flex items-center gap-2 bg-[#9B2335] text-white px-6 py-2.5 rounded hover:opacity-80 transition-opacity shadow-[0_4px_14px_rgba(155,35,53,0.4)]"
        >
          <span className="material-symbols-outlined font-light text-[18px]">add</span>
          <span className="font-['Nunito'] text-[13px] font-bold tracking-wide">Nuevo Producto</span>
        </button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {productos.map((prod) => (
          <div key={prod.id} className="bg-[#141414]/60 border border-[#D4AF6A]/20 p-6 rounded-xl relative group hover:border-[#D4AF6A]/50 hover:-translate-y-1 transition-all duration-300 shadow-[0_8px_30px_rgba(0,0,0,0.4)] backdrop-blur-md">
            
            {prod.destacado && (
              <div className="absolute -top-3 -left-3 px-3 py-1 bg-[#D4AF6A] text-[#101010] text-[9px] font-bold tracking-widest uppercase font-['JetBrains_Mono'] shadow-lg rounded">
                Signature
              </div>
            )}

            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                onClick={() => handleEdit(prod)}
                className="w-8 h-8 rounded-full bg-[#1a1a1a] border border-[#D4AF6A]/30 flex items-center justify-center text-[#D4AF6A]/70 hover:text-[#D4AF6A] hover:bg-[#D4AF6A]/10 transition-colors shadow-lg"
              >
                <span className="material-symbols-outlined text-[16px] font-light">edit</span>
              </button>
              <button className="w-8 h-8 rounded-full bg-[#1a1a1a] border border-[#9B2335]/30 flex items-center justify-center text-[#9B2335]/70 hover:text-[#9B2335] hover:bg-[#9B2335]/10 transition-colors shadow-lg">
                <span className="material-symbols-outlined text-[16px] font-light">delete</span>
              </button>
            </div>

            <div className="flex items-center gap-5 mt-2 mb-6">
              <div className="w-16 h-16 bg-[#1a1a1a] rounded-lg flex items-center justify-center text-[#D4AF6A] border border-[#D4AF6A]/20 shadow-inner">
                <span className="material-symbols-outlined text-3xl font-light opacity-90">{prod.icono}</span>
              </div>
              <div className="flex-1">
                <h3 className="font-['Outfit'] text-[16px] text-[#F2EDE4] font-semibold">{prod.nombre}</h3>
                <p className="font-['JetBrains_Mono'] text-[#D4AF6A] mt-1 text-[13px] tracking-wider font-bold">
                  ${prod.precio.toFixed(2)}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#D4AF6A]/10">
              <div className="flex flex-col gap-1">
                <span className="font-['JetBrains_Mono'] text-[9px] uppercase tracking-[0.2em] text-[#D4AF6A]/50">Categoría</span>
                <span className="font-['JetBrains_Mono'] text-[11px] tracking-wider text-[#F2EDE4]/70">
                  {prod.categoria}
                </span>
              </div>
              <div className="flex flex-col gap-1 items-end">
                <span className="font-['JetBrains_Mono'] text-[9px] uppercase tracking-[0.2em] text-[#D4AF6A]/50">ID</span>
                <span className="font-['JetBrains_Mono'] text-[10px] text-[#F2EDE4]/30">
                  #{prod.id.toString().padStart(4, '0')}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <AdminModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={currentProduct ? "Editar Producto" : "Nuevo Producto"}
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-[#D4AF6A]/70 font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.2em] mb-2">Nombre del Producto</label>
            <input 
              type="text" 
              defaultValue={currentProduct?.nombre || ""} 
              required 
              className="w-full bg-[#1a1a1a] border border-[#D4AF6A]/20 rounded-lg px-4 py-2.5 text-[#F2EDE4] font-['Nunito'] text-sm focus:outline-none focus:border-[#D4AF6A]/50 transition-colors" 
              placeholder="Ej. Sushi Mix"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="block text-[#D4AF6A]/70 font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.2em] mb-2">Precio ($)</label>
              <input 
                type="number" 
                step="0.01"
                defaultValue={currentProduct?.precio || ""} 
                required 
                className="w-full bg-[#1a1a1a] border border-[#D4AF6A]/20 rounded-lg px-4 py-2.5 text-[#F2EDE4] font-['Nunito'] text-sm focus:outline-none focus:border-[#D4AF6A]/50 transition-colors" 
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-[#D4AF6A]/70 font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.2em] mb-2">Categoría</label>
              <select 
                defaultValue={currentProduct?.categoria || ""} 
                required 
                className="w-full bg-[#1a1a1a] border border-[#D4AF6A]/20 rounded-lg px-4 py-2.5 text-[#F2EDE4] font-['Nunito'] text-sm focus:outline-none focus:border-[#D4AF6A]/50 transition-colors appearance-none"
              >
                <option value="" disabled>Seleccionar...</option>
                <option value="Entradas">Entradas</option>
                <option value="Plato Principal">Plato Principal</option>
                <option value="Sushi">Sushi</option>
                <option value="Postres">Postres</option>
                <option value="Bebidas">Bebidas</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[#D4AF6A]/70 font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.2em] mb-2">Ícono (Material Symbol)</label>
            <input 
              type="text" 
              defaultValue={currentProduct?.icono || "restaurant"} 
              className="w-full bg-[#1a1a1a] border border-[#D4AF6A]/20 rounded-lg px-4 py-2.5 text-[#F2EDE4] font-['Nunito'] text-sm focus:outline-none focus:border-[#D4AF6A]/50 transition-colors" 
              placeholder="Ej. set_meal, ramen_dining"
            />
          </div>

          <div className="flex items-center gap-3 mt-4 pt-4 border-t border-[#D4AF6A]/10">
            <input 
              type="checkbox" 
              id="destacado" 
              defaultChecked={currentProduct?.destacado || false}
              className="w-4 h-4 accent-[#D4AF6A] bg-[#1a1a1a] border-[#D4AF6A]/30 rounded"
            />
            <label htmlFor="destacado" className="text-[#F2EDE4]/70 font-['Nunito'] text-sm">
              Marcar como platillo "Signature" (Destacado)
            </label>
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
              {currentProduct ? "Actualizar Producto" : "Crear Producto"}
            </button>
          </div>
        </form>
      </AdminModal>
    </div>
  );
}
export default AdminProductos;
