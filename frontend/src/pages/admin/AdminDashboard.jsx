import { useState, useEffect, useCallback } from "react";
import api from "../../services/api";
import { getPedidosCliente } from "../../services/pedidosService";
import { io } from "socket.io-client";

function AdminDashboard() {
  const [metricas, setMetricas] = useState({
    totalPedidos: 0,
    ingresosDia: 0,
    usuariosActivos: 0, // inicializado en 0
  });
  const [pedidosRecientes, setPedidosRecientes] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDashboardData = useCallback(async (showLoader = true) => {
    if (showLoader) setIsLoading(true);
    try {
      // 1. Cargar métricas dinámicas de MongoDB
      const metricasResponse = await api.get("/pedidos/metricas");
      if (metricasResponse.data) {
        setMetricas({
          totalPedidos: metricasResponse.data.totalPedidos ?? 0,
          ingresosDia: metricasResponse.data.ingresosDia ?? 0,
          usuariosActivos: metricasResponse.data.usuariosActivos ?? 0,
        });
      }

      // 2. Cargar los últimos pedidos reales de MongoDB y tomar los 5 más recientes
      const pedidosResponse = await getPedidosCliente();
      if (Array.isArray(pedidosResponse)) {
        setPedidosRecientes(pedidosResponse.slice(0, 5));
      }

      // 3. Cargar usuarios para mostrar nombres reales
      try {
        const usuariosResponse = await api.get("/usuarios");
        if (Array.isArray(usuariosResponse.data)) {
          setUsuarios(usuariosResponse.data);
        }
      } catch (error) {
        console.error("Error al obtener usuarios para el Dashboard:", error);
      }
    } catch (error) {
      console.error("Error al obtener los datos del Dashboard:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData(true);
  }, [fetchDashboardData]);

  useEffect(() => {
    const socket = io("http://localhost:5000");

    socket.on("connect", () => {
      console.log("[WS] Admin Dashboard conectado al API Gateway");
      // Volver a consultar de inmediato para reflejar esta nueva conexión activa
      fetchDashboardData(false);
    });

    // Escuchar actualizaciones de pedidos para refrescar el dashboard en tiempo real
    socket.on("pedido_actualizado", () => {
      console.log("[WS] Actualización de pedido detectada, refrescando dashboard...");
      fetchDashboardData(false);
    });

    return () => {
      socket.disconnect();
    };
  }, [fetchDashboardData]);

  const getEstadoEstilo = (estado) => {
    switch (estado) {
      case "pendiente":
        return "bg-orange-500/10 border-orange-500/30 text-orange-400";
      case "preparando":
        return "bg-[#D4AF6A]/10 border-[#D4AF6A]/30 text-[#D4AF6A]";
      case "en_camino":
        return "bg-blue-500/10 border-blue-500/30 text-blue-400";
      case "entregado":
        return "bg-green-500/10 border-green-500/30 text-green-400";
      default:
        return "bg-[#F2EDE4]/5 border-[#F2EDE4]/20 text-[#F2EDE4]/50";
    }
  };

  const getEstadoDisplay = (estado) => {
    switch (estado) {
      case "pendiente": return "Pendiente";
      case "preparando": return "Preparando";
      case "en_camino": return "En Camino";
      case "entregado": return "Entregado";
      default: return estado;
    }
  };

  return (
    <div>
      <h2 className="text-[24px] font-['Outfit'] text-[#F2EDE4] mb-10 tracking-widest uppercase">
        Resumen del Sistema Real
      </h2>
      
      {isLoading ? (
        <div className="text-center text-[#D4AF6A] font-['JetBrains_Mono'] mt-20">
          Cargando panel de control en tiempo real...
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
            {/* Tarjeta 1 - Pedidos Totales */}
            <div className="bg-[#141414]/60 border border-[#D4AF6A]/20 p-8 rounded-xl hover:border-[#D4AF6A]/50 transition-all duration-300 shadow-[0_8px_30px_rgba(0,0,0,0.4)] backdrop-blur-md">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-[#F2EDE4]/60 font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.3em]">
                  Total Pedidos
                </h3>
                <span className="material-symbols-outlined text-[#D4AF6A] font-light">receipt_long</span>
              </div>
              <p className="text-[44px] font-['Outfit'] text-[#F2EDE4] leading-none mb-4">
                {metricas.totalPedidos}
              </p>
              <p className="text-[10px] text-[#D4AF6A]/50 font-['JetBrains_Mono'] tracking-[0.2em] uppercase">Pedidos en base de datos</p>
            </div>

            {/* Tarjeta 2 - Ingresos del Día */}
            <div className="bg-[#141414]/60 border border-[#D4AF6A]/20 p-8 rounded-xl hover:border-[#D4AF6A]/50 transition-all duration-300 shadow-[0_8px_30px_rgba(0,0,0,0.4)] backdrop-blur-md">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-[#F2EDE4]/60 font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.3em]">
                  Ingresos del Día
                </h3>
                <span className="material-symbols-outlined text-[#D4AF6A] font-light">payments</span>
              </div>
              <p className="text-[44px] font-['Outfit'] text-[#D4AF6A] leading-none mb-4">
                ${metricas.ingresosDia.toFixed(2)}
              </p>
              <p className="text-[10px] text-[#D4AF6A]/50 font-['JetBrains_Mono'] tracking-[0.2em] uppercase">Ventas entregadas hoy</p>
            </div>

            {/* Tarjeta 3 - Usuarios Activos */}
            <div className="bg-[#141414]/60 border border-[#D4AF6A]/20 p-8 rounded-xl hover:border-[#D4AF6A]/50 transition-all duration-300 shadow-[0_8px_30px_rgba(0,0,0,0.4)] backdrop-blur-md">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-[#F2EDE4]/60 font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.3em]">
                  Usuarios Activos
                </h3>
                <span className="material-symbols-outlined text-[#D4AF6A] font-light">group</span>
              </div>
              <p className="text-[44px] font-['Outfit'] text-[#F2EDE4] leading-none mb-4">
                {metricas.usuariosActivos}
              </p>
              <p className="text-[10px] text-[#D4AF6A]/50 font-['JetBrains_Mono'] tracking-[0.2em] uppercase">Conexiones estimadas</p>
            </div>
          </div>

          {/* Tabla de Últimos Pedidos Reales */}
          <div className="bg-[#141414]/60 border border-[#D4AF6A]/20 p-10 rounded-xl backdrop-blur-md shadow-[0_8px_30px_rgba(0,0,0,0.4)]">
            <h3 className="text-[16px] font-['Outfit'] text-[#F2EDE4] mb-8 tracking-widest uppercase">
              Últimos Pedidos Reales
            </h3>
            
            {pedidosRecientes.length === 0 ? (
              <div className="flex items-center justify-center h-48 border border-dashed border-[#D4AF6A]/20 rounded-lg bg-[#141414]/40">
                <p className="text-[#F2EDE4]/40 font-['Nunito'] text-sm tracking-wide">
                  No hay pedidos registrados en MongoDB.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[#D4AF6A]/10 pb-4">
                      <th className="font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.2em] text-[#D4AF6A]/60 py-4">ID Pedido</th>
                      <th className="font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.2em] text-[#D4AF6A]/60 py-4">Cliente Ref</th>
                      <th className="font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.2em] text-[#D4AF6A]/60 py-4">Total</th>
                      <th className="font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.2em] text-[#D4AF6A]/60 py-4">Método Pago</th>
                      <th className="font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.2em] text-[#D4AF6A]/60 py-4">Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pedidosRecientes.map((pedido) => {
                      const clienteAsignado = usuarios.find(u => (u._id || u.id) === pedido.clienteId);
                      return (
                        <tr key={pedido._id} className="border-b border-[#D4AF6A]/5 hover:bg-[#1a1a1a]/40 transition-colors">
                          <td className="font-['JetBrains_Mono'] text-[12px] text-[#D4AF6A] py-4">
                            {String(pedido._id || '').slice(-6).toUpperCase()}
                          </td>
                          <td className="font-['Nunito'] text-[13px] text-[#F2EDE4] py-4">
                            {clienteAsignado ? clienteAsignado.nombre : (pedido.clienteId ? `CL-${String(pedido.clienteId).slice(-6).toUpperCase()}` : "Anónimo")}
                          </td>
                          <td className="font-['Outfit'] text-[14px] text-[#D4AF6A] font-semibold py-4">
                            ${pedido.total.toFixed(2)}
                          </td>
                          <td className="font-['Nunito'] text-[12px] text-[#F2EDE4]/60 py-4 capitalize">
                            {pedido.metodoPago || "Efectivo"}
                          </td>
                          <td className="py-4">
                            <span className={`px-2.5 py-0.5 border rounded-full text-[9px] uppercase tracking-widest font-['JetBrains_Mono'] ${getEstadoEstilo(pedido.estado)}`}>
                              {getEstadoDisplay(pedido.estado)}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default AdminDashboard;