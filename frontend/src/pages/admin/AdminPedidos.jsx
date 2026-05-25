function AdminPedidos() {
  const pedidos = [
    { id: "ORD-001", cliente: "María López", total: 450.00, estado: "Preparando", items: 3, tiempo: "Hace 10 min" },
    { id: "ORD-002", cliente: "Carlos García", total: 120.00, estado: "En Camino", items: 1, tiempo: "Hace 25 min" },
    { id: "ORD-003", cliente: "Ana Martínez", total: 850.00, estado: "Cancelado", items: 5, tiempo: "Hace 1 hora" },
    { id: "ORD-004", cliente: "Luis Torres", total: 320.00, estado: "Entregado", items: 2, tiempo: "Ayer" },
    { id: "ORD-005", cliente: "Sofía Ruiz", total: 180.00, estado: "Preparando", items: 1, tiempo: "Hace 5 min" },
    { id: "ORD-006", cliente: "Jorge Silva", total: 540.00, estado: "En Camino", items: 4, tiempo: "Hace 40 min" },
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
            
            {/* Actions (visible on hover) */}
            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="w-8 h-8 rounded-full bg-[#1a1a1a] border border-[#D4AF6A]/30 flex items-center justify-center text-[#D4AF6A]/70 hover:text-[#D4AF6A] hover:bg-[#D4AF6A]/10 transition-colors shadow-lg" title="Ver Ticket">
                <span className="material-symbols-outlined text-[16px] font-light">visibility</span>
              </button>
              {pedido.estado !== 'Cancelado' && pedido.estado !== 'Entregado' && (
                <>
                  <button className="w-8 h-8 rounded-full bg-[#1a1a1a] border border-[#D4AF6A]/30 flex items-center justify-center text-[#D4AF6A]/70 hover:text-[#D4AF6A] hover:bg-[#D4AF6A]/10 transition-colors shadow-lg" title="Editar Estado">
                    <span className="material-symbols-outlined text-[16px] font-light">edit</span>
                  </button>
                  <button className="w-8 h-8 rounded-full bg-[#1a1a1a] border border-[#9B2335]/30 flex items-center justify-center text-[#9B2335]/70 hover:text-[#9B2335] hover:bg-[#9B2335]/10 transition-colors shadow-lg" title="Cancelar Pedido">
                    <span className="material-symbols-outlined text-[16px] font-light">cancel</span>
                  </button>
                </>
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
              <span className="font-['JetBrains_Mono'] text-[9px] uppercase tracking-[0.2em] text-[#D4AF6A]/50">Total</span>
              <span className={`font-['Outfit'] text-[20px] font-bold ${pedido.estado === 'Cancelado' ? 'text-[#F2EDE4]/50 line-through' : 'text-[#D4AF6A]'}`}>
                ${pedido.total.toFixed(2)}
              </span>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}
export default AdminPedidos;
