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

const ESTADOS = [
  {
    key: "pendiente",
    label: "Pendiente",
    desc: "Tu pedido fue recibido y está en espera.",
    color: "#C8901A",
    icon: "schedule",
  },
  {
    key: "en_preparacion",
    label: "En preparación",
    desc: "El equipo de cocina está preparando tu orden.",
    color: "#9B2335",
    icon: "soup_kitchen",
  },
  {
    key: "listo",
    label: "Listo",
    desc: "Tu pedido está listo para ser recogido.",
    color: "#2D7A4F",
    icon: "check_circle",
  },
  {
    key: "entregado",
    label: "Entregado",
    desc: "Orden completada. ¡Buen provecho!",
    color: "#7a6655",
    icon: "celebration",
  },
];

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
          opacity: 0,
          animation: "pedidoFadeUp 0.25s ease 0.05s both",
        }}
      >
        <p className="font-['DM_Sans'] text-[10px] text-[#9B2335] uppercase tracking-[0.3em] mb-3">
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
            className="flex-1 py-3 font-['DM_Sans'] text-xs uppercase tracking-widest text-[#7a6655] hover:text-[#2f1f14] transition-colors"
            style={{ border: "1px solid rgba(90,70,54,0.25)" }}
          >
            Cancelar
          </button>
          <button
            onClick={onAceptar}
            className="flex-1 py-3 bg-[#9B2335] font-['DM_Sans'] text-xs uppercase tracking-widest text-white hover:bg-[#7d1c2a] transition-colors active:scale-[0.98]"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}

function PanelEstado({ pedido, onCerrar }) {
  const idxActual = ESTADOS.findIndex((e) => e.key === pedido.estado);
  const sucursal = SUCURSALES[pedido.sucursalId ?? SUCURSAL_DEFAULT];

  return (
    <div
      className="absolute top-4 right-4 bottom-4 z-20 flex flex-col overflow-hidden"
      style={{
        width: "260px",
        background: "rgba(10,6,3,0.94)",
        border: "1px solid rgba(212,175,106,0.14)",
        backdropFilter: "blur(14px)",
        opacity: 0,
        animation: "panelSlideRight 0.3s ease 0.05s both",
      }}
    >
      <div
        className="px-5 py-5 flex items-start justify-between flex-shrink-0"
        style={{ borderBottom: "1px solid rgba(212,175,106,0.1)" }}
      >
        <div>
          <p className="font-['DM_Sans'] text-[9px] text-[#9B2335] uppercase tracking-[0.3em] mb-1">
            #{String(pedido.id).slice(-4).padStart(4, "0")}
          </p>
          <p className="font-['EB_Garamond'] text-[17px] text-[#F2E6D8] leading-tight">
            Estado del pedido
          </p>
        </div>
        <button
          onClick={onCerrar}
          className="w-6 h-6 flex items-center justify-center text-[#5a4636] hover:text-[#F2E6D8] transition-colors flex-shrink-0 mt-0.5"
          style={{ border: "1px solid rgba(212,175,106,0.15)" }}
        >
          <span className="font-['DM_Sans'] text-[10px]">✕</span>
        </button>
      </div>

      <div
        className="px-5 py-5 flex-shrink-0"
        style={{ borderBottom: "1px solid rgba(212,175,106,0.08)" }}
      >
        <p className="font-['DM_Sans'] text-[9px] text-[#5a4636] uppercase tracking-widest mb-1">
          Sucursal
        </p>
        <p className="font-['DM_Sans'] text-[15px] font-medium text-[#F2E6D8]">
          {sucursal.nombre}
        </p>
        <p className="font-['DM_Sans'] text-[10px] text-[#5a4636] mt-0.5 leading-snug">
          {sucursal.direccion}
        </p>
      </div>

      <div
        className="flex-1 overflow-y-auto px-5 py-5"
        style={{ overscrollBehavior: "contain" }}
      >
        <p className="font-['DM_Sans'] text-[9px] text-[#5a4636] uppercase tracking-widest mb-4">
          Progreso
        </p>
        <div className="flex flex-col gap-2">
          {ESTADOS.map((e, i) => {
            const done = i < idxActual;
            const activo = i === idxActual;
            const futuro = i > idxActual;
            return (
              <div key={e.key} className="flex gap-3">
                <div className="flex flex-col items-center flex-shrink-0">
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center transition-all duration-500 flex-shrink-0"
                    style={{
                      background: activo
                        ? "#9B2335"
                        : done
                          ? "#D4AF6A"
                          : "rgba(212,175,106,0.15)",
                      border: `1px solid ${futuro ? "rgba(212,175,106,0.15)" : "rgba(212,175,106,0.85)"}`,
                      boxShadow: activo
                        ? "0 0 10px rgba(155, 35, 53, 0.55)"
                        : "none",
                    }}
                  >
                    <span
                      className="material-symbols-outlined"
                      style={{
                        fontSize: "12px",
                        color: activo
                          ? "#fff"
                          : done
                            ? "#3D3530"
                            : "rgba(61,53,48,0.35)",
                      }}
                    >
                      {e.icon}
                    </span>
                  </div>
                  {i < ESTADOS.length - 1 && (
                    <div
                      className="w-px flex-1 my-1 transition-all duration-500"
                      style={{
                        minHeight: "36px",
                        background: done
                          ? "rgba(212,175,106,0.65)"
                          : "rgba(212,175,106,0.15)",
                      }}
                    />
                  )}
                </div>
                <div className="pb-5">
                  <p
                    className="font-['DM_Sans'] text-[9px] uppercase tracking-wider mb-0.5"
                    style={{
                      color: activo
                        ? "#9B2335"
                        : done
                          ? "#D4AF6A"
                          : "rgba(212,175,106,0.4)",
                    }}
                  >
                    {e.label}
                  </p>
                  {activo && (
                    <p
                      className="font-['DM_Sans'] text-[11px] leading-snug"
                      style={{ color: "rgba(242,230,216,0.55)" }}
                    >
                      {e.desc}
                    </p>
                  )}
                  {done && (
                    <p
                      className="font-['DM_Sans'] text-[9px]"
                      style={{ color: "rgba(90,70,54,0.5)" }}
                    >
                      Completado
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div
        className="px-5 py-5 flex items-center justify-between flex-shrink-0"
        style={{
          borderTop: "1px solid rgba(212,175,106,0.08)",
          background: "rgba(0,0,0,0.25)",
        }}
      >
        <div>
          <p className="font-['DM_Sans'] text-[9px] text-[#5a4636] uppercase tracking-widest">
            {pedido.items.reduce((a, i) => a + i.cantidad, 0)} productos
          </p>
          <p className="font-['DM_Sans'] text-[11px] text-[#F2E6D8]/50 mt-0.5">
            {pedido.fecha}
          </p>
        </div>
        <div className="text-right">
          <p className="font-['DM_Sans'] text-[9px] text-[#5a4636] uppercase tracking-widest">
            Total
          </p>
          <p className="font-['EB_Garamond'] text-xl text-[#D4AF6A]">
            ${pedido.total.toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
}

function VistaPedidos({ pedidos = [], onConfirmarPedido }) {
  const [mostrarModal, setMostrarModal] = useState(false);
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);

  const pedidoActivo = pedidos.find((p) => p.id === pedidoSeleccionado) ?? null;
  const sucursalActiva = pedidoActivo
    ? SUCURSALES[pedidoActivo.sucursalId ?? SUCURSAL_DEFAULT]
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
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes panelSlideRight {
          from { opacity: 0; transform: translateX(16px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes sidebarSlideLeft {
          from { opacity: 0; transform: translateX(-24px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes mapaFadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
      `}</style>

      <div className="flex pt-20" style={{ height: "calc(100vh - 5rem)" }}>
        {/* Sidebar izquierdo — entra desde la izquierda */}
        <div
          className="flex-shrink-0 flex flex-col"
          style={{
            width: "400px",
            background:
              "linear-gradient(180deg, rgba(20,16,14,0.98) 0%, rgba(12,10,9,0.98) 55%, rgba(10,10,10,0.98) 100%)",
            borderRight: "1px solid rgba(212,175,106,0.14)",
            opacity: 0,
            animation: "sidebarSlideLeft 0.5s ease 0.1s both",
          }}
        >
          {/* Header sidebar */}
          <div
            className="px-6 pt-7 pb-5 flex-shrink-0"
            style={{
              borderBottom: "1px solid rgba(212,175,106,0.14)",
              opacity: 0,
              animation: "pedidoFadeUp 0.4s ease 0.2s both",
              background:
                "linear-gradient(180deg, rgba(41,9,8,0.85) 0%, rgba(10,10,10,0.25) 100%)",
            }}
          >
            <p className="font-['DM_Sans'] text-[10px] text-[#9B2335] uppercase tracking-[0.3em] mb-1.5">
              — Mis pedidos
            </p>
            <div className="flex items-baseline justify-between">
              <h1 className="font-['EB_Garamond'] text-3xl text-[#F2E6D8] tracking-tight">
                Órdenes
              </h1>
              {pedidos.length > 0 && (
                <span className="font-['DM_Sans'] text-[10px] text-[#5a4636] uppercase tracking-widest">
                  {pedidos.length} {pedidos.length === 1 ? "orden" : "órdenes"}
                </span>
              )}
            </div>
          </div>

          {/* Lista de pedidos */}
          <div
            className="flex-grow overflow-y-auto px-4 py-4 space-y-3"
            style={{ overscrollBehavior: "contain" }}
          >
            {pedidos.length === 0 ? (
              <div
                className="px-3"
                style={{
                  opacity: 0,
                  animation: "pedidoFadeUp 0.5s ease 0.3s both",
                }}
              >
                <div
                  className="p-5"
                  style={{
                    background:
                      "linear-gradient(145deg, rgba(28, 22, 18, 0.94) 0%, rgba(20, 16, 14, 0.94) 55%, rgba(14, 12, 10, 0.94) 100%)",
                    border: "1px solid rgba(155,35,53,0.2)",
                    borderRadius: "14px",
                    boxShadow: "0 10px 24px rgba(0,0,0,0.35)",
                  }}
                >
                  <p className="font-['EB_Garamond'] text-xl text-[#F2E6D8] mb-2">
                    No hay pedidos realizados hoy
                  </p>
                  <p className="font-['DM_Sans'] text-xs text-[#5a4636]">
                    Confirma un pedido desde el carrito para verlo aquí.
                  </p>
                </div>
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
                  }}
                >
                  <PedidoCard pedido={p} index={i} />
                </div>
              ))
            )}
          </div>
        </div>

        {/* Panel derecho — mapa */}
        {pedidos.length > 0 && (
          <div
            className="flex-1 flex flex-col relative"
            style={{
              background: "#0a0a0a",
              opacity: 0,
              animation: "mapaFadeIn 0.6s ease 0.3s both",
            }}
          >
            {/* Header mapa */}
            <div
              className="px-8 py-5 flex-shrink-0 flex items-center justify-between"
              style={{
                borderBottom: "1px solid rgba(212,175,106,0.16)",
                background:
                  "linear-gradient(90deg, rgba(41,9,8,0.95) 0%, rgba(26,26,26,0.95) 55%, rgba(12,10,9,0.95) 100%)",
                boxShadow: "0 10px 24px rgba(0,0,0,0.4)",
                opacity: 0,
                animation: "pedidoFadeUp 0.4s ease 0.4s both",
              }}
            >
              <div>
                <p className="font-['JetBrains_Mono'] text-[9px] text-[#9B2335] uppercase tracking-[0.25em] mb-1">
                  — Sucursal asignada
                </p>
                <p className="font-['EB_Garamond'] text-[24px] text-[#F2EDE4] leading-tight">
                  {sucursalActiva.nombre}
                </p>
                <p className="font-['DM_Sans'] text-[11px] text-[#5a4636]">
                  {sucursalActiva.direccion}
                </p>
              </div>
              {pedidoSeleccionado !== null && (
                <button
                  onClick={() => setPedidoSeleccionado(null)}
                  className="font-['DM_Sans'] text-[10px] text-[#5a4636] uppercase tracking-widest hover:text-[#F2E6D8] transition-colors"
                >
                  ✕ Cerrar
                </button>
              )}
            </div>

            {/* Mapa */}
            <div className="flex-1 flex items-center justify-center p-6">
              <div
                className="relative w-full h-full overflow-hidden"
                style={{
                  maxWidth: "860px",
                  maxHeight: "520px",
                  borderRadius: "16px",
                  border: "1px solid rgba(212,175,106,0.28)",
                  boxShadow:
                    "0 18px 32px rgba(0,0,0,0.45), 0 0 0 1px rgba(26,26,26,0.8) inset",
                  background: "#1A1A1A",
                }}
              >
                <iframe
                  key={sucursalActiva.embedUrl}
                  title="Mapa sucursal"
                  src={sucursalActiva.embedUrl}
                  width="100%"
                  height="100%"
                  style={{
                    border: 0,
                    display: "block",
                    filter:
                      "grayscale(1) contrast(0.92) sepia(0.2) brightness(0.8)",
                    pointerEvents: "none",
                  }}
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    pointerEvents: "all",
                    cursor: "default",
                    background:
                      "linear-gradient(180deg, rgba(41,9,8,0.22) 0%, rgba(10,10,10,0.45) 100%)",
                    mixBlendMode: "multiply",
                  }}
                />

                <div
                  className="absolute top-4 left-4 px-4 py-3"
                  style={{
                    background: "rgba(10,10,10,0.7)",
                    border: "1px solid rgba(212,175,106,0.2)",
                    borderRadius: "12px",
                    boxShadow: "0 10px 20px rgba(0,0,0,0.35)",
                    backdropFilter: "blur(6px)",
                  }}
                >
                  <p className="font-['JetBrains_Mono'] text-[9px] uppercase tracking-[0.25em] text-[#9B2335] mb-1">
                    Sucursal asignada
                  </p>
                  <p className="font-['EB_Garamond'] text-[18px] text-[#F2EDE4] leading-tight">
                    {sucursalActiva.nombre}
                  </p>
                  <p className="font-['DM_Sans'] text-[10px] text-[#D4AF6A]/80">
                    {sucursalActiva.direccion}
                  </p>
                </div>

                <div className="absolute top-4 right-4 flex flex-col gap-2">
                  <button
                    type="button"
                    className="w-8 h-8 flex items-center justify-center text-[#D4AF6A]"
                    style={{
                      background: "rgba(10,10,10,0.7)",
                      border: "1px solid rgba(212,175,106,0.25)",
                      borderRadius: "999px",
                    }}
                  >
                    +
                  </button>
                  <button
                    type="button"
                    className="w-8 h-8 flex items-center justify-center text-[#D4AF6A]"
                    style={{
                      background: "rgba(10,10,10,0.7)",
                      border: "1px solid rgba(212,175,106,0.25)",
                      borderRadius: "999px",
                    }}
                  >
                    -
                  </button>
                  <button
                    type="button"
                    className="w-8 h-8 flex items-center justify-center text-[#D4AF6A]"
                    style={{
                      background: "rgba(10,10,10,0.7)",
                      border: "1px solid rgba(212,175,106,0.25)",
                      borderRadius: "999px",
                    }}
                  >
                    ⌖
                  </button>
                </div>

                {/* Pin */}
                <div
                  className="absolute top-1/2 pointer-events-none transition-all duration-300"
                  style={{
                    left: "50%",
                    transform: "translate(-50%, -100%)",
                  }}
                >
                  <div
                    className="w-6 h-6 rounded-full bg-[#9B2335] border-2 border-[#D4AF6A]"
                    style={{
                      boxShadow:
                        "0 0 0 6px rgba(155,35,53,0.25), 0 0 16px rgba(155,35,53,0.75)",
                    }}
                  />
                </div>

                <div
                  className="absolute left-4 bottom-4 px-3 py-2"
                  style={{
                    background: "rgba(10,10,10,0.7)",
                    border: "1px solid rgba(212,175,106,0.18)",
                    borderRadius: "10px",
                  }}
                >
                  <p className="font-['JetBrains_Mono'] text-[9px] uppercase tracking-[0.25em] text-[#D4AF6A]">
                    Mapa activo · pin Casablanca
                  </p>
                </div>
              </div>

              {pedidoActivo && (
                <PanelEstado
                  pedido={pedidoActivo}
                  onCerrar={() => setPedidoSeleccionado(null)}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default VistaPedidos;
