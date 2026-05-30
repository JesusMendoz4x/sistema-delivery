import { useState, useEffect } from "react";
import AdminModal from "../../components/AdminModal";
import api from "../../services/api";
import { getPedidosCliente } from "../../services/pedidosService";

function AdminPedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [repartidores, setRepartidores] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPedido, setCurrentPedido] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPedidos = async () => {
    setIsLoading(true);
    try {
      const data = await getPedidosCliente();
      setPedidos(data);
    } catch (error) {
      console.error("Error al obtener pedidos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRepartidores = async () => {
    try {
      const response = await api.get("/repartidores");
      setRepartidores(response.data);
    } catch (error) {
      console.error("Error al obtener flotilla de repartidores:", error);
    }
  };

  const fetchUsuarios = async () => {
    try {
      const response = await api.get("/usuarios");
      setUsuarios(response.data);
    } catch (error) {
      console.error("Error al obtener la lista de usuarios:", error);
    }
  };

  useEffect(() => {
    const initializeData = async () => {
      await fetchPedidos();
      await fetchRepartidores();
      await fetchUsuarios();
    };
    initializeData();
  }, []);

  const getEstadoEstilo = (estado) => {
    switch(estado) {
      case "pendiente": return "bg-orange-500/10 border-orange-500/30 text-orange-400";
      case "preparando": return "bg-[#D4AF6A]/10 border-[#D4AF6A]/30 text-[#D4AF6A]";
      case "en_camino": return "bg-[#9B2335]/20 border-[#9B2335]/40 text-[#dfbfbf]";
      case "entregado": return "bg-green-500/10 border-green-500/30 text-green-400";
      case "cancelado": return "bg-red-500/10 border-red-500/30 text-red-400 opacity-60";
      default: return "bg-[#F2EDE4]/5 border-[#F2EDE4]/20 text-[#F2EDE4]/50";
    }
  };

  const getEstadoIcono = (estado) => {
    switch(estado) {
      case "preparando": return "soup_kitchen";
      case "en_camino": return "two_wheeler";
      case "entregado": return "check_circle";
      case "cancelado": return "block";
      default: return "receipt_long";
    }
  };

  const getEstadoDisplay = (estado) => {
    switch(estado) {
      case "pendiente": return "Pendiente";
      case "preparando": return "Preparando";
      case "en_camino": return "En Camino";
      case "entregado": return "Entregado";
      case "cancelado": return "Cancelado";
      default: return estado;
    }
  };

  const formatTiempo = (dateStr) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return "Hace un momento";
    if (diffMins < 60) return `Hace ${diffMins} min`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `Hace ${diffHours} h`;
    
    return date.toLocaleDateString();
  };

  const handleView = (pedido) => {
    setCurrentPedido(pedido);
    setIsModalOpen(true);
  };

  const handleCancelar = async (pedidoId) => {
    if(window.confirm("¿Seguro de cancelar este pedido de forma manual?")) {
      try {
        await api.put(`/pedidos/${pedidoId}/estado`, { estado: "cancelado" });
        await fetchPedidos();
      } catch (error) {
        console.error("Error al cancelar pedido:", error);
      }
    }
  };

  const handleActualizarDetalles = async (e) => {
    e.preventDefault();
    const selectEstado = e.target.elements.estado.value;
    const selectRepartidor = e.target.elements.repartidor.value;

    try {
      const pedidoId = currentPedido._id || currentPedido.id;
      
      // 1. Actualizar estado
      await api.put(`/pedidos/${pedidoId}/estado`, { estado: selectEstado });
      
      // 2. Actualizar repartidor si cambió
      await api.put(`/pedidos/${pedidoId}/repartidor`, { repartidorId: selectRepartidor || null });
      
      setIsModalOpen(false);
      await fetchPedidos();
    } catch (error) {
      console.error("Error al actualizar la orden:", error);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-[24px] font-['Outfit'] text-[#F2EDE4] tracking-widest uppercase">
          Gestión de Órdenes Real-Time
        </h2>
      </div>

      {isLoading ? (
        <div className="text-center text-[#D4AF6A] font-['JetBrains_Mono'] mt-20">
          Cargando pedidos activos...
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {pedidos.map((pedido) => {
            const countItems = pedido.productos?.reduce((a, p) => a + p.cantidad, 0) || 0;
            const repartidorAsignado = repartidores.find(r => r._id === pedido.repartidorId);
            const clienteAsignado = usuarios.find(u => (u._id || u.id) === pedido.clienteId);
            
            return (
              <div key={pedido._id} className={`bg-[#141414]/60 border border-[#D4AF6A]/20 p-6 rounded-xl relative group hover:border-[#D4AF6A]/50 hover:-translate-y-1 transition-all duration-300 shadow-[0_8px_30px_rgba(0,0,0,0.4)] backdrop-blur-md ${pedido.estado === 'cancelado' ? 'opacity-70 grayscale-[0.3]' : ''}`}>
                
                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => handleView(pedido)}
                    className="w-8 h-8 rounded-full bg-[#1a1a1a] border border-[#D4AF6A]/30 flex items-center justify-center text-[#D4AF6A]/70 hover:text-[#D4AF6A] hover:bg-[#D4AF6A]/10 transition-colors shadow-lg" 
                    title="Detalles y Asignación"
                  >
                    <span className="material-symbols-outlined text-[16px] font-light">visibility</span>
                  </button>
                  {pedido.estado !== 'cancelado' && pedido.estado !== 'entregado' && (
                    <button 
                      onClick={() => handleCancelar(pedido._id)}
                      className="w-8 h-8 rounded-full bg-[#1a1a1a] border border-[#9B2335]/30 flex items-center justify-center text-[#9B2335]/70 hover:text-[#9B2335] hover:bg-[#9B2335]/10 transition-colors shadow-lg" 
                      title="Cancelar Pedido"
                    >
                      <span className="material-symbols-outlined text-[16px] font-light">cancel</span>
                    </button>
                  )}
                </div>

                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="font-['JetBrains_Mono'] text-[#D4AF6A] text-[13px] tracking-wider mb-1">
                      {`ORD-${String(pedido._id || '').slice(-6).toUpperCase()}`}
                    </h3>
                    <p className="font-['JetBrains_Mono'] text-[#F2EDE4]/40 text-[10px] tracking-widest uppercase">
                      {formatTiempo(pedido.createdAt)}
                    </p>
                  </div>
                  <span className={`px-2.5 py-1 border rounded-full text-[9px] uppercase tracking-widest font-['JetBrains_Mono'] flex items-center gap-1 ${getEstadoEstilo(pedido.estado)}`}>
                    <span className="material-symbols-outlined text-[12px]">{getEstadoIcono(pedido.estado)}</span>
                    {getEstadoDisplay(pedido.estado)}
                  </span>
                </div>

                <div className="flex items-center gap-4 mb-5">
                  <div className="w-10 h-10 rounded-full bg-[#1a1a1a] border border-[#D4AF6A]/20 flex items-center justify-center text-[#F2EDE4]/70 font-['Outfit'] text-[16px]">
                    C
                  </div>
                  <div>
                    <p className="font-['Nunito'] text-[#F2EDE4] text-[15px] font-semibold">
                      {clienteAsignado ? clienteAsignado.nombre : `Cliente #${String(pedido.clienteId || '').slice(-6).toUpperCase()}`}
                    </p>
                    <p className="font-['Nunito'] text-[#F2EDE4]/50 text-[12px]">{countItems} artículo(s)</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#D4AF6A]/10 flex justify-between items-end">
                  <div className="flex flex-col gap-1">
                    <span className="font-['JetBrains_Mono'] text-[9px] uppercase tracking-[0.2em] text-[#D4AF6A]/50">Repartidor</span>
                    <span className="font-['JetBrains_Mono'] text-[10px] text-[#F2EDE4]/70">
                      {repartidorAsignado ? repartidorAsignado.nombre : "Sin Asignar"}
                    </span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="font-['JetBrains_Mono'] text-[9px] uppercase tracking-[0.2em] text-[#D4AF6A]/50">Total</span>
                    <span className={`font-['Outfit'] text-[20px] font-bold ${pedido.estado === 'cancelado' ? 'text-[#F2EDE4]/50 line-through' : 'text-[#D4AF6A]'}`}>
                      ${pedido.total.toFixed(2)}
                    </span>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Ticket de detalle del Pedido */}
      <AdminModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={currentPedido ? `Detalle Ticket ORD-${String(currentPedido._id || '').slice(-6).toUpperCase()}` : "Detalles"}
      >
        {currentPedido && (() => {
          const clienteModal = usuarios.find(u => (u._id || u.id) === currentPedido.clienteId);
          return (
            <form onSubmit={handleActualizarDetalles} className="space-y-6">
              <div className="flex items-center gap-4 p-4 bg-[#1a1a1a] border border-[#D4AF6A]/20 rounded-lg">
                <div className="w-12 h-12 rounded-full bg-[#141414] border border-[#D4AF6A]/30 flex items-center justify-center text-[#D4AF6A] font-['Outfit'] text-[20px]">
                  C
                </div>
                <div>
                  <h3 className="font-['Nunito'] text-[#F2EDE4] text-[16px] font-semibold">
                    {clienteModal ? `${clienteModal.nombre}` : `Cliente ID: ${currentPedido.clienteId}`}
                  </h3>
                  <p className="font-['JetBrains_Mono'] text-[#F2EDE4]/50 text-[10px] uppercase tracking-widest">
                    {clienteModal ? `Tel: ${clienteModal.telefono} · ` : ""}Creado: {new Date(currentPedido.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-['JetBrains_Mono'] text-[#D4AF6A]/70 text-[10px] uppercase tracking-[0.2em]">Platillos en la Orden</h4>
                <div className="bg-[#1a1a1a] border border-[#D4AF6A]/20 rounded-lg p-4 max-h-[160px] overflow-y-auto">
                  {currentPedido.productos?.map((p, idx) => (
                    <div key={p.productoId || idx} className="flex justify-between items-center mb-2 pb-2 border-b border-[#D4AF6A]/10 last:border-0 last:mb-0 last:pb-0">
                      <span className="font-['Nunito'] text-[#F2EDE4] text-sm">
                        {p.cantidad}x {p.nombre || "Platillo"}
                      </span>
                      <span className="font-['JetBrains_Mono'] text-[#D4AF6A] text-sm">
                        ${(p.cantidad * (p.precioUnitario || 0)).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <h4 className="font-['JetBrains_Mono'] text-[#D4AF6A]/70 text-[10px] uppercase tracking-[0.2em]">Dirección de Entrega</h4>
                <p className="text-sm font-['Nunito'] text-[#F2EDE4] bg-[#1a1a1a] border border-[#D4AF6A]/15 rounded-lg px-4 py-2.5">
                  {currentPedido.direccionEntrega}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-[#D4AF6A]/70 font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.2em] mb-2">Estado del Pedido</label>
                  <select 
                    name="estado"
                    defaultValue={currentPedido.estado} 
                    className="w-full bg-[#1a1a1a] border border-[#D4AF6A]/20 rounded-lg px-4 py-2.5 text-[#F2EDE4] font-['Nunito'] text-sm focus:outline-none focus:border-[#D4AF6A]/50 transition-colors appearance-none"
                  >
                    <option value="pendiente">Pendiente (Sin Conductor)</option>
                    <option value="preparando">Preparando Cocina</option>
                    <option value="en_camino">En Camino (Delivery)</option>
                    <option value="entregado">Entregado con Éxito</option>
                    <option value="cancelado">Cancelado</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[#D4AF6A]/70 font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.2em] mb-2">Asignar Repartidor</label>
                  <select 
                    name="repartidor"
                    defaultValue={currentPedido.repartidorId || ""} 
                    className="w-full bg-[#1a1a1a] border border-[#D4AF6A]/20 rounded-lg px-4 py-2.5 text-[#F2EDE4] font-['Nunito'] text-sm focus:outline-none focus:border-[#D4AF6A]/50 transition-colors appearance-none"
                  >
                    <option value="">Sin Asignar</option>
                    {repartidores.map(r => (
                      <option key={r._id} value={r._id}>
                        {`${r.nombre} (${r.estado === 'disponible' ? 'Disponible' : 'Ocupado'})`}
                      </option>
                    ))}
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
          );
        })()}
      </AdminModal>
    </div>
  );
}

export default AdminPedidos;
