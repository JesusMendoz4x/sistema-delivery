import { useState, useEffect } from "react";
import { getPedidos } from "../../services/pedidosService";
import { getUsuarios } from "../../services/usuariosService";

const estadoLabel = {
  pendiente: "Pendiente",
  preparando: "Preparando",
  en_camino: "En Camino",
  entregado: "Entregado",
  cancelado: "Cancelado",
};

// Tarjeta de métrica del dashboard (definida fuera del componente para
// evitar recrearla en cada render).
function Stat({ titulo, valor, icono, sub, cargando }) {
  return (
    <div className="bg-[#141414]/60 border border-[#D4AF6A]/20 p-8 rounded-xl hover:border-[#D4AF6A]/50 transition-all duration-300 shadow-[0_8px_30px_rgba(0,0,0,0.4)] backdrop-blur-md">
      <div className="flex justify-between items-start mb-6">
        <h3 className="text-[#F2EDE4]/60 font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.3em]">{titulo}</h3>
        <span className="material-symbols-outlined text-[#D4AF6A] font-light">{icono}</span>
      </div>
      <p className="text-[44px] font-['Outfit'] text-[#F2EDE4] leading-none mb-4">
        {cargando ? "···" : valor}
      </p>
      <p className="text-[10px] text-[#D4AF6A]/50 font-['JetBrains_Mono'] tracking-[0.2em] uppercase">{sub}</p>
    </div>
  );
}

function AdminDashboard() {
  const [pedidos, setPedidos] = useState([]);
  const [totalUsuarios, setTotalUsuarios] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [peds, usuarios] = await Promise.all([
          getPedidos().catch(() => []),
          getUsuarios().catch(() => []),
        ]);
        setPedidos(peds);
        setTotalUsuarios(usuarios.length);
      } finally {
        setCargando(false);
      }
    })();
  }, []);

  const totalPedidos = pedidos.length;
  const ingresos = pedidos
    .filter((p) => p.estado !== "cancelado")
    .reduce((acc, p) => acc + (Number(p.total) || 0), 0);
  const ultimos = pedidos.slice(0, 5);

  return (
    <div>
      <h2 className="text-[24px] font-['Outfit'] text-[#F2EDE4] mb-10 tracking-widest uppercase">
        Resumen del Sistema
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
        <Stat titulo="Total Pedidos" valor={totalPedidos} icono="receipt_long" sub="datos en vivo" cargando={cargando} />
        <Stat
          titulo="Ingresos (no cancelados)"
          valor={`$${ingresos.toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          icono="payments"
          sub="suma de pedidos"
          cargando={cargando}
        />
        <Stat
          titulo="Usuarios Registrados"
          valor={totalUsuarios ?? "—"}
          icono="group"
          sub="cuentas totales"
          cargando={cargando}
        />
      </div>

      <div className="bg-[#141414]/60 border border-[#D4AF6A]/20 p-10 rounded-xl backdrop-blur-md shadow-[0_8px_30px_rgba(0,0,0,0.4)]">
        <h3 className="text-[16px] font-['Outfit'] text-[#F2EDE4] mb-8 tracking-widest uppercase">Últimos Pedidos</h3>

        {cargando ? (
          <div className="flex items-center justify-center h-32 text-[#D4AF6A] font-['JetBrains_Mono'] text-sm">Cargando...</div>
        ) : ultimos.length === 0 ? (
          <div className="flex items-center justify-center h-32 border border-dashed border-[#D4AF6A]/20 rounded-lg bg-[#141414]/40">
            <p className="text-[#F2EDE4]/40 font-['Nunito'] text-sm tracking-wide">Aún no hay pedidos registrados.</p>
          </div>
        ) : (
          <div className="divide-y divide-[#D4AF6A]/10">
            {ultimos.map((p) => (
              <div key={p.id} className="flex items-center justify-between py-4">
                <div className="flex flex-col">
                  <span className="font-['JetBrains_Mono'] text-[#D4AF6A] text-[12px] tracking-wider">#{String(p.id).slice(-6)}</span>
                  <span className="font-['Nunito'] text-[#F2EDE4]/50 text-[11px]">
                    Cliente #{String(p.clienteId).slice(-6)} · {p.productos?.length || 0} producto(s)
                  </span>
                </div>
                <div className="flex items-center gap-6">
                  <span className="font-['JetBrains_Mono'] text-[10px] uppercase tracking-widest text-[#F2EDE4]/60">
                    {estadoLabel[p.estado] || p.estado}
                  </span>
                  <span className="font-['Outfit'] text-[#D4AF6A] text-[16px] font-bold">
                    ${Number(p.total).toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
