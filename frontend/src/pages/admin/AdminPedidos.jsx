import { useState, useEffect } from "react";
import AdminModal from "../../components/AdminModal";
import {
  getPedidos,
  actualizarEstadoPedido,
  asignarRepartidor,
} from "../../services/pedidosService";
import { getRepartidores } from "../../services/repartidoresService";

const ESTADOS = ["pendiente", "preparando", "en_camino", "entregado", "cancelado"];

const estadoLabel = {
  pendiente: "Pendiente",
  preparando: "Preparando",
  en_camino: "En Camino",
  entregado: "Entregado",
  cancelado: "Cancelado",
};

function AdminPedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [repartidores, setRepartidores] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [current, setCurrent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = async () => {
    try {
      const [peds, reps] = await Promise.all([
        getPedidos(),
        getRepartidores().catch(() => []),
      ]);
      setPedidos(peds);
      setRepartidores(reps);
      setError("");
    } catch (err) {
      console.error("Error al cargar pedidos", err);
      setError("No se pudieron cargar los pedidos (¿sesión activa?).");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getEstadoEstilo = (estado) => {
    switch (estado) {
      case "preparando": return "bg-[#D4AF6A]/10 border-[#D4AF6A]/30 text-[#D4AF6A]";
      case "en_camino": return "bg-[#9B2335]/20 border-[#9B2335]/40 text-[#dfbfbf]";
      case "entregado": return "bg-green-500/10 border-green-500/30 text-green-400";
      case "cancelado": return "bg-red-500/10 border-red-500/30 text-red-400 opacity-60";
      default: return "bg-[#F2EDE4]/5 border-[#F2EDE4]/20 text-[#F2EDE4]/50";
    }
  };

  const getEstadoIcono = (estado) => {
    switch (estado) {
      case "preparando": return "soup_kitchen";
      case "en_camino": return "two_wheeler";
      case "entregado": return "check_circle";
      case "cancelado": return "block";
      default: return "receipt_long";
    }
  };

  const nombreRepartidor = (id) => {
    if (!id) return null;
    const r = repartidores.find((x) => x.id === id);
    return r ? r.nombre : `#${String(id).slice(-6)}`;
  };

  const handleView = (pedido) => {
    setCurrent(pedido);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const nuevoEstado = formData.get("estado");
    const repartidorId = formData.get("repartidorId");

    try {
      // Si se eligió un repartidor distinto al actual, lo asignamos (crea ruta + WS).
      if (repartidorId && repartidorId !== (current.repartidorId || "")) {
        await asignarRepartidor(current.id, repartidorId);
      }
      // Si el estado cambió, lo actualizamos.
      if (nuevoEstado && nuevoEstado !== current.estado) {
        await actualizarEstadoPedido(current.id, nuevoEstado);
      }
      setIsModalOpen(false);
      await fetchData();
    } catch (err) {
      console.error("Error al actualizar pedido", err);
      window.alert(
        err.response?.data?.message || "No se pudo actualizar el pedido.",
      );
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-[24px] font-['Outfit'] text-[#F2EDE4] tracking-widest uppercase">
          Gestión de Órdenes
        </h2>
        <button
          onClick={fetchData}
          className="flex items-center gap-2 bg-[#141414]/60 border border-[#D4AF6A]/20 text-[#D4AF6A] px-5 py-2 rounded hover:bg-[#D4AF6A]/10 transition-colors shadow-lg backdrop-blur-md"
        >
          <span className="material-symbols-outlined font-light text-[18px]">refresh</span>
          <span className="font-['Nunito'] text-[12px] font-bold tracking-wide">Actualizar</span>
        </button>
      </div>

      {error && (
        <div className="mb-6 text-[#E57474] font-['JetBrains_Mono'] text-[12px] uppercase tracking-widest">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="text-center text-[#D4AF6A] font-['JetBrains_Mono'] mt-20">Cargando órdenes...</div>
      ) : pedidos.length === 0 ? (
        <div className="text-center text-[#F2EDE4]/40 font-['Nunito'] mt-20">Aún no hay pedidos registrados.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {pedidos.map((pedido) => {
            const numItems = pedido.productos.reduce((a, p) => a + (p.cantidad || 1), 0);
            return (
              <div key={pedido.id} className={`bg-[#141414]/60 border border-[#D4AF6A]/20 p-6 rounded-xl relative group hover:border-[#D4AF6A]/50 hover:-translate-y-1 transition-all duration-300 shadow-[0_8px_30px_rgba(0,0,0,0.4)] backdrop-blur-md ${pedido.estado === "cancelado" ? "opacity-70 grayscale-[0.3]" : ""}`}>

                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleView(pedido)}
                    className="w-8 h-8 rounded-full bg-[#1a1a1a] border border-[#D4AF6A]/30 flex items-center justify-center text-[#D4AF6A]/70 hover:text-[#D4AF6A] hover:bg-[#D4AF6A]/10 transition-colors shadow-lg"
                    title="Detalles y Asignación"
                  >
                    <span className="material-symbols-outlined text-[16px] font-light">visibility</span>
                  </button>
                </div>

                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="font-['JetBrains_Mono'] text-[#D4AF6A] text-[13px] tracking-wider mb-1">
                      #{String(pedido.id).slice(-6)}
                    </h3>
                    <p className="font-['JetBrains_Mono'] text-[#F2EDE4]/40 text-[10px] tracking-widest uppercase">
                      {pedido.createdAt ? new Date(pedido.createdAt).toLocaleString("es-MX") : ""}
                    </p>
                  </div>
                  <span className={`px-2.5 py-1 border rounded-full text-[9px] uppercase tracking-widest font-['JetBrains_Mono'] flex items-center gap-1 ${getEstadoEstilo(pedido.estado)}`}>
                    <span className="material-symbols-outlined text-[12px]">{getEstadoIcono(pedido.estado)}</span>
                    {estadoLabel[pedido.estado] || pedido.estado}
                  </span>
                </div>

                <div className="flex items-center gap-4 mb-5">
                  <div className="w-10 h-10 rounded-full bg-[#1a1a1a] border border-[#D4AF6A]/20 flex items-center justify-center text-[#F2EDE4]/70 font-['Outfit'] text-[16px]">
                    <span className="material-symbols-outlined text-[18px]">person</span>
                  </div>
                  <div>
                    <p className="font-['Nunito'] text-[#F2EDE4] text-[13px] font-semibold">Cliente #{String(pedido.clienteId).slice(-6)}</p>
                    <p className="font-['Nunito'] text-[#F2EDE4]/50 text-[12px]">{numItems} artículo(s)</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#D4AF6A]/10 flex justify-between items-end">
                  <div className="flex flex-col gap-1">
                    <span className="font-['JetBrains_Mono'] text-[9px] uppercase tracking-[0.2em] text-[#D4AF6A]/50">Repartidor</span>
                    <span className="font-['JetBrains_Mono'] text-[10px] text-[#F2EDE4]/70">
                      {nombreRepartidor(pedido.repartidorId) || "Sin Asignar"}
                    </span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="font-['JetBrains_Mono'] text-[9px] uppercase tracking-[0.2em] text-[#D4AF6A]/50">Total</span>
                    <span className={`font-['Outfit'] text-[20px] font-bold ${pedido.estado === "cancelado" ? "text-[#F2EDE4]/50 line-through" : "text-[#D4AF6A]"}`}>
                      ${Number(pedido.total).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <AdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Ticket #${current ? String(current.id).slice(-6) : ""}`}
      >
        {current && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex items-center gap-4 p-4 bg-[#1a1a1a] border border-[#D4AF6A]/20 rounded-lg">
              <div className="w-12 h-12 rounded-full bg-[#141414] border border-[#D4AF6A]/30 flex items-center justify-center text-[#D4AF6A]">
                <span className="material-symbols-outlined">person</span>
              </div>
              <div>
                <h3 className="font-['Nunito'] text-[#F2EDE4] text-[15px] font-semibold">Cliente #{String(current.clienteId).slice(-6)}</h3>
                <p className="font-['JetBrains_Mono'] text-[#F2EDE4]/50 text-[10px] uppercase tracking-widest">{current.direccionEntrega}</p>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-['JetBrains_Mono'] text-[#D4AF6A]/70 text-[10px] uppercase tracking-[0.2em]">Detalle del Pedido</h4>
              <div className="bg-[#1a1a1a] border border-[#D4AF6A]/20 rounded-lg p-4">
                {current.productos.map((p, i) => (
                  <div key={i} className="flex justify-between items-center mb-2 pb-2 border-b border-[#D4AF6A]/10 last:border-0 last:mb-0 last:pb-0">
                    <span className="font-['Nunito'] text-[#F2EDE4] text-sm">{p.cantidad}x {p.nombre}</span>
                    <span className="font-['JetBrains_Mono'] text-[#D4AF6A] text-sm">${(Number(p.precioUnitario) * (p.cantidad || 1)).toFixed(2)}</span>
                  </div>
                ))}
                <div className="flex justify-between items-center mt-4 pt-4 border-t border-[#D4AF6A]/20">
                  <span className="font-['JetBrains_Mono'] text-[#D4AF6A] text-[12px] uppercase tracking-[0.2em]">Total</span>
                  <span className="font-['Outfit'] text-[#D4AF6A] text-[22px] font-bold">${Number(current.total).toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="block text-[#D4AF6A]/70 font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.2em] mb-2">Estado del Pedido</label>
                <select
                  name="estado"
                  defaultValue={current.estado}
                  className="w-full bg-[#1a1a1a] border border-[#D4AF6A]/20 rounded-lg px-4 py-2.5 text-[#F2EDE4] font-['Nunito'] text-sm focus:outline-none focus:border-[#D4AF6A]/50 transition-colors appearance-none"
                >
                  {ESTADOS.map((e) => (
                    <option key={e} value={e}>{estadoLabel[e]}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[#D4AF6A]/70 font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.2em] mb-2">Asignar Repartidor</label>
                <select
                  name="repartidorId"
                  defaultValue={current.repartidorId || ""}
                  className="w-full bg-[#1a1a1a] border border-[#D4AF6A]/20 rounded-lg px-4 py-2.5 text-[#F2EDE4] font-['Nunito'] text-sm focus:outline-none focus:border-[#D4AF6A]/50 transition-colors appearance-none"
                >
                  <option value="">Sin Asignar</option>
                  {repartidores.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.nombre} ({estadoLabel[r.estado] || r.estado})
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
        )}
      </AdminModal>
    </div>
  );
}
export default AdminPedidos;
