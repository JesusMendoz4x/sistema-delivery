import { useState } from "react";
import AdminModal from "../../components/AdminModal";

function AdminPedidos() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPedido, setCurrentPedido] = useState(null);

  const pedidos = [
    { id: "ORD-001", cliente: "María López", total: 450.00, estado: "Preparando", items: 3, tiempo: "Hace 10 min", repartidor: null },
    { id: "ORD-002", cliente: "Carlos García", total: 120.00, estado: "En Camino", items: 1, tiempo: "Hace 25 min", repartidor: "Juan R." },
    { id: "ORD-003", cliente: "Ana Martínez", total: 850.00, estado: "Cancelado", items: 5, tiempo: "Hace 1 hora", repartidor: null },
    { id: "ORD-004", cliente: "Luis Torres", total: 320.00, estado: "Entregado", items: 2, tiempo: "Ayer", repartidor: "Pedro M." },
    { id: "ORD-005", cliente: "Sofía Ruiz", total: 180.00, estado: "Preparando", items: 1, tiempo: "Hace 5 min", repartidor: null },
    { id: "ORD-006", cliente: "Jorge Silva", total: 540.00, estado: "En Camino", items: 4, tiempo: "Hace 40 min", repartidor: "Juan R." },
  ];

  const getEstadoEstilo = (estado) => {
    switch(estado) {
      case "Preparando": return "bg-[#D4AF6A]/10 border-[#D4AF6A]/30 text-[#D4AF6A]";
      case "En Camino": return "bg-[#9B2335]/20 border-[#9B2335]/40 text-[#dfbfbf]";
      case "Entregado": return "bg-green-500/10 border-green-500/30 text-green-400";
      case "Cancelado": return "bg-red-500/10 border-red-500/30 text-red-400 opacity-60";
      default: return "bg-[#F2EDE4]/5 border-[#F2EDE4]/20 text-[#F2EDE4]/50";
    }
  };

  const getEstadoIcono = (estado) => {
    switch(estado) {
      case "Preparando": return "soup_kitchen";
      case "En Camino": return "two_wheeler";
      case "Entregado": return "check_circle";
      case "Cancelado": return "block";
      default: return "receipt_long";
    }
  };

  const handleView = (pedido) => {
    setCurrentPedido(pedido);
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
          Gestión de Órdenes
        </h2>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 bg-[#141414]/60 border border-[#D4AF6A]/20 text-[#D4AF6A] px-5 py-2 rounded hover:bg-[#D4AF6A]/10 transition-colors shadow-lg backdrop-blur-md">
            <span className="material-symbols-outlined font-light text-[18px]">filter_list</span>
            <span className="font-['Nunito'] text-[12px] font-bold tracking-wide">Filtrar</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {pedidos.map((pedido) => (
          <div key={pedido.id} className={`bg-[#141414]/60 border border-[#D4AF6A]/20 p-6 rounded-xl relative group hover:border-[#D4AF6A]/50 hover:-translate-y-1 transition-all duration-300 shadow-[0_8px_30px_rgba(0,0,0,0.4)] backdrop-blur-md ${pedido.estado === 'Cancelado' ? 'opacity-70 grayscale-[0.3]' : ''}`}>
            
            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                onClick={() => handleView(pedido)}
                className="w-8 h-8 rounded-full bg-[#1a1a1a] border border-[#D4AF6A]/30 flex items-center justify-center text-[#D4AF6A]/70 hover:text-[#D4AF6A] hover:bg-[#D4AF6A]/10 transition-colors shadow-lg" 
                title="Detalles y Asignación"
              >
                <span className="material-symbols-outlined text-[16px] font-light">visibility</span>
              </button>
              {pedido.estado !== 'Cancelado' && pedido.estado !== 'Entregado' && (
                <button className="w-8 h-8 rounded-full bg-[#1a1a1a] border border-[#9B2335]/30 flex items-center justify-center text-[#9B2335]/70 hover:text-[#9B2335] hover:bg-[#9B2335]/10 transition-colors shadow-lg" title="Cancelar Pedido">
                  <span className="material-symbols-outlined text-[16px] font-light">cancel</span>
                </button>
              )}
            </div>

            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="font-['JetBrains_Mono'] text-[#D4AF6A] text-[13px] tracking-wider mb-1">
                  {pedido.id}
                </h3>
                <p className="font-['JetBrains_Mono'] text-[#F2EDE4]/40 text-[10px] tracking-widest uppercase">
                  {pedido.tiempo}
                </p>
              </div>
              <span className={`px-2.5 py-1 border rounded-full text-[9px] uppercase tracking-widest font-['JetBrains_Mono'] flex items-center gap-1 ${getEstadoEstilo(pedido.estado)}`}>
                <span className="material-symbols-outlined text-[12px]">{getEstadoIcono(pedido.estado)}</span>
                {pedido.estado}
              </span>
            </div>

            <div className="flex items-center gap-4 mb-5">
              <div className="w-10 h-10 rounded-full bg-[#1a1a1a] border border-[#D4AF6A]/20 flex items-center justify-center text-[#F2EDE4]/70 font-['Outfit'] text-[16px]">
                {pedido.cliente.charAt(0)}
              </div>
              <div>
                <p className="font-['Nunito'] text-[#F2EDE4] text-[15px] font-semibold">{pedido.cliente}</p>
                <p className="font-['Nunito'] text-[#F2EDE4]/50 text-[12px]">{pedido.items} artículo(s)</p>
              </div>
            </div>

            <div className="pt-4 border-t border-[#D4AF6A]/10 flex justify-between items-end">
              <div className="flex flex-col gap-1">
                <span className="font-['JetBrains_Mono'] text-[9px] uppercase tracking-[0.2em] text-[#D4AF6A]/50">Repartidor</span>
                <span className="font-['JetBrains_Mono'] text-[10px] text-[#F2EDE4]/70">
                  {pedido.repartidor ? pedido.repartidor : "Sin Asignar"}
                </span>
              </div>
              <div className="flex flex-col items-end">
                <span className="font-['JetBrains_Mono'] text-[9px] uppercase tracking-[0.2em] text-[#D4AF6A]/50">Total</span>
                <span className={`font-['Outfit'] text-[20px] font-bold ${pedido.estado === 'Cancelado' ? 'text-[#F2EDE4]/50 line-through' : 'text-[#D4AF6A]'}`}>
                  ${pedido.total.toFixed(2)}
                </span>
              </div>
            </div>

          </div>
        ))}
      </div>

      <AdminModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={`Ticket ${currentPedido?.id || ""}`}
      >
        {currentPedido && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex items-center gap-4 p-4 bg-[#1a1a1a] border border-[#D4AF6A]/20 rounded-lg">
              <div className="w-12 h-12 rounded-full bg-[#141414] border border-[#D4AF6A]/30 flex items-center justify-center text-[#D4AF6A] font-['Outfit'] text-[20px]">
                {currentPedido.cliente.charAt(0)}
              </div>
              <div>
                <h3 className="font-['Nunito'] text-[#F2EDE4] text-[16px] font-semibold">{currentPedido.cliente}</h3>
                <p className="font-['JetBrains_Mono'] text-[#F2EDE4]/50 text-[10px] uppercase tracking-widest">{currentPedido.tiempo}</p>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-['JetBrains_Mono'] text-[#D4AF6A]/70 text-[10px] uppercase tracking-[0.2em]">Detalle del Pedido</h4>
              <div className="bg-[#1a1a1a] border border-[#D4AF6A]/20 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2 pb-2 border-b border-[#D4AF6A]/10">
                  <span className="font-['Nunito'] text-[#F2EDE4] text-sm">2x Tonkotsu Ramen</span>
                  <span className="font-['JetBrains_Mono'] text-[#D4AF6A] text-sm">$360.00</span>
                </div>
                <div className="flex justify-between items-center mb-2 pb-2 border-b border-[#D4AF6A]/10">
                  <span className="font-['Nunito'] text-[#F2EDE4] text-sm">1x Edamames al Vapor</span>
                  <span className="font-['JetBrains_Mono'] text-[#D4AF6A] text-sm">$65.00</span>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="font-['JetBrains_Mono'] text-[#D4AF6A]/50 text-[10px] uppercase tracking-[0.2em]">Costo de Envío</span>
                  <span className="font-['JetBrains_Mono'] text-[#F2EDE4]/70 text-sm">$25.00</span>
                </div>
                <div className="flex justify-between items-center mt-4 pt-4 border-t border-[#D4AF6A]/20">
                  <span className="font-['JetBrains_Mono'] text-[#D4AF6A] text-[12px] uppercase tracking-[0.2em]">Total</span>
                  <span className="font-['Outfit'] text-[#D4AF6A] text-[22px] font-bold">${currentPedido.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="block text-[#D4AF6A]/70 font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.2em] mb-2">Estado del Pedido</label>
                <select 
                  defaultValue={currentPedido.estado} 
                  className="w-full bg-[#1a1a1a] border border-[#D4AF6A]/20 rounded-lg px-4 py-2.5 text-[#F2EDE4] font-['Nunito'] text-sm focus:outline-none focus:border-[#D4AF6A]/50 transition-colors appearance-none"
                >
                  <option value="Preparando">Preparando</option>
                  <option value="En Camino">En Camino</option>
                  <option value="Entregado">Entregado</option>
                  <option value="Cancelado">Cancelado</option>
                </select>
              </div>
              <div>
                <label className="block text-[#D4AF6A]/70 font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.2em] mb-2">Asignar Repartidor</label>
                <select 
                  defaultValue={currentPedido.repartidor || ""} 
                  className="w-full bg-[#1a1a1a] border border-[#D4AF6A]/20 rounded-lg px-4 py-2.5 text-[#F2EDE4] font-['Nunito'] text-sm focus:outline-none focus:border-[#D4AF6A]/50 transition-colors appearance-none"
                >
                  <option value="">Sin Asignar</option>
                  <option value="Juan R.">Juan R. (Disponible)</option>
                  <option value="Pedro M.">Pedro M. (En ruta)</option>
                  <option value="Luis F.">Luis F. (Disponible)</option>
                </select>
              </div>
            </div>

            <div className="pt-6 mt-6 flex justify-end gap-3 border-t border-[#D4AF6A]/10">
              <button 
                type="button" 
                onClick={() => setIsModalOpen(false)} 
                className="px-5 py-2.5 rounded-lg font-['Nunito'] text-[13px] text-[#F2EDE4]/70 hover:bg-[#F2EDE4]/10 hover:text-[#F2EDE4] transition-colors"
              >
                Cerrar
              </button>
              <button 
                type="submit" 
                className="bg-[#D4AF6A] text-[#101010] px-6 py-2.5 rounded-lg font-['Nunito'] text-[13px] font-bold hover:opacity-90 transition-opacity shadow-[0_4px_14px_rgba(212,175,106,0.3)]"
              >
                Actualizar Pedido
              </button>
            </div>
          </form>
        )}
      </AdminModal>
    </div>
  );
}
export default AdminPedidos;
