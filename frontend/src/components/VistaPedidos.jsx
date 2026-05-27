import { useState } from "react";
import PedidoCard from "./PedidoCard";

const SUCURSALES = {
  1: {
    nombre: "Sucursal Centro",
    direccion: "Macedonio Alcalá 402, Centro Histórico, Oaxaca",
    embedUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3814.3!2d-96.7266!3d17.0604!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85c722b3c314fd23%3A0x3b9b8a1f34e4c1e4!2sMacedonio%20Alc%C3%A1l%C3%A1%20402%2C%20Oaxaca!5e0!3m2!1ses!2smx!4v1700000000000",
  },
};

const SUCURSAL_DEFAULT = 1;

function ModalConfirmar({ onAceptar, onCancelar }) {
  const suc = SUCURSALES[SUCURSAL_DEFAULT];
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(10,10,10,0.85)", backdropFilter: "blur(4px)" }}
    >
      <div
        className="w-full max-w-sm mx-4 p-8"
        style={{
          background: "#F2E6D8",
          border: "1px solid rgba(90,70,54,0.2)",
          animation: "pedidoFadeUp 0.25s ease both",
        }}
      >
        <p className="font-['JetBrains_Mono'] text-[10px] text-[#9B2335] uppercase tracking-[0.3em] mb-3">
          — Confirmar orden
        </p>
        <h2 className="font-['EB_Garamond'] text-2xl text-[#2f1f14] mb-2">
          ¿Seguro que quieres confirmar?
        </h2>
        <p className="font-['DM_Sans'] text-sm text-[#7a6655] mb-8">
          Tu pedido será enviado a {suc.nombre} y no podrás modificarlo.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancelar}
            className="flex-1 py-3 font-['JetBrains_Mono'] text-xs uppercase tracking-widest text-[#7a6655] hover:text-[#2f1f14] transition-colors"
            style={{ border: "1px solid rgba(90,70,54,0.25)" }}
          >
            Cancelar
          </button>
          <button
            onClick={onAceptar}
            className="flex-1 py-3 bg-[#9B2335] font-['JetBrains_Mono'] text-xs uppercase tracking-widest text-white hover:bg-[#7d1c2a] transition-colors active:scale-[0.98]"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}

function VistaPedidos({ pedidos = [], onConfirmarPedido }) {
  const [mostrarModal, setMostrarModal] = useState(false);
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);

  const sucursalActiva =
    pedidoSeleccionado !== null
      ? SUCURSALES[
          pedidos.find((p) => p.id === pedidoSeleccionado)?.sucursalId ??
            SUCURSAL_DEFAULT
        ]
      : SUCURSALES[SUCURSAL_DEFAULT];

  const handleAceptar = () => {
    setMostrarModal(false);
    onConfirmarPedido?.();
  };
  const handleCancelar = () => setMostrarModal(false);
  const handlePedidoClick = (id) =>
    setPedidoSeleccionado((prev) => (prev === id ? null : id));

  return (
    <>
      {mostrarModal && (
        <ModalConfirmar onAceptar={handleAceptar} onCancelar={handleCancelar} />
      )}

      <style>{`
        @keyframes pedidoFadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
      `}</style>

      <div className="flex pt-20" style={{ height: "calc(100vh - 5rem)" }}>
        {/* ── Sidebar izquierdo — fondo negro, tarjetas beige ── */}
        <div
          className="flex-shrink-0 flex flex-col"
          style={{
            width: "400px",
            background: "rgb(10,10,10)",
            borderRight: "1px solid rgba(212,175,106,0.08)",
          }}
        >
          {/* Encabezado */}
          <div
            className="px-6 pt-7 pb-5 flex-shrink-0"
            style={{ borderBottom: "1px solid rgba(212,175,106,0.08)" }}
          >
            <p className="font-['JetBrains_Mono'] text-[10px] text-[#9B2335] uppercase tracking-[0.3em] mb-1.5">
              — Mis pedidos
            </p>
            <div className="flex items-baseline justify-between">
              <h1 className="font-['EB_Garamond'] text-3xl text-[#F2E6D8] tracking-tight">
                Órdenes
              </h1>
              {pedidos.length > 0 && (
                <span className="font-['JetBrains_Mono'] text-[10px] text-[#5a4636] uppercase tracking-widest">
                  {pedidos.length} {pedidos.length === 1 ? "orden" : "órdenes"}
                </span>
              )}
            </div>
          </div>

          {/* Lista scrolleable */}
          <div
            className="flex-grow overflow-y-auto px-4 py-4 space-y-3"
            style={{ overscrollBehavior: "contain" }}
          >
            {pedidos.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center px-4">
                <p className="font-['EB_Garamond'] text-2xl text-[#F2E6D8]/15 mb-2">
                  Sin órdenes
                </p>
                <p className="font-['DM_Sans'] text-xs text-[#5a4636]">
                  Confirma un pedido desde el carrito para verlo aquí
                </p>
              </div>
            ) : (
              pedidos.map((p, i) => (
                <div
                  key={p.id}
                  onClick={() => handlePedidoClick(p.id)}
                  className="cursor-pointer transition-all duration-150"
                  style={{
                    outline:
                      pedidoSeleccionado === p.id
                        ? "2px solid rgba(155,35,53,0.55)"
                        : "2px solid transparent",
                    outlineOffset: "0px",
                  }}
                >
                  <PedidoCard pedido={p} index={i} />
                </div>
              ))
            )}
          </div>
        </div>

        {/* ── Panel derecho — mapa ── */}
        <div className="flex-1 flex flex-col" style={{ background: "#0a0a0a" }}>
          {/* Header mapa */}
          <div
            className="px-8 py-5 flex-shrink-0 flex items-center justify-between"
            style={{
              borderBottom: "1px solid rgba(212,175,106,0.08)",
              background: "#0d0806",
            }}
          >
            <div>
              <p className="font-['JetBrains_Mono'] text-[10px] text-[#9B2335] uppercase tracking-[0.25em] mb-0.5">
                — Sucursal asignada
              </p>
              <p className="font-['EB_Garamond'] text-xl text-[#F2E6D8]">
                {sucursalActiva.nombre}
              </p>
              <p className="font-['DM_Sans'] text-[11px] text-[#5a4636]">
                {sucursalActiva.direccion}
              </p>
            </div>
            {pedidoSeleccionado !== null && (
              <button
                onClick={() => setPedidoSeleccionado(null)}
                className="font-['JetBrains_Mono'] text-[10px] text-[#5a4636] uppercase tracking-widest hover:text-[#F2E6D8] transition-colors"
              >
                ← Todas
              </button>
            )}
          </div>

          {/* Mapa */}
          <div className="flex-1 relative overflow-hidden">
            <iframe
              key={sucursalActiva.embedUrl}
              title="Mapa sucursal"
              src={sucursalActiva.embedUrl}
              width="100%"
              height="100%"
              style={{
                border: 0,
                display: "block",
                filter: "grayscale(1) contrast(0.88) sepia(0.12)",
                pointerEvents: "none",
              }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            <div
              className="absolute inset-0"
              style={{ pointerEvents: "all", cursor: "default" }}
            />
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-full pointer-events-none">
              <div
                className="w-5 h-5 rounded-full bg-[#9B2335] border-2 border-[#F2E6D8]"
                style={{ boxShadow: "0 0 12px rgba(155,35,53,0.7)" }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default VistaPedidos;
