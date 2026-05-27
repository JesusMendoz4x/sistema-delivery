2;
import { useState } from "react";

const SUCURSAL = {
  nombre: "Sucursal Centro",
  direccion: "Macedonio Alcalá 402, Centro Histórico",
};

export const ESTADOS = [
  {
    key: "pendiente",
    label: "Pendiente",
    color: "#9B4A1A",
    bg: "rgba(155,74,26,0.10)",
  },
  {
    key: "en_preparacion",
    label: "En preparación",
    color: "#9B2335",
    bg: "rgba(155,35,53,0.10)",
  },
  {
    key: "listo",
    label: "Listo",
    color: "#2D7A4F",
    bg: "rgba(45,122,79,0.10)",
  },
  {
    key: "entregado",
    label: "Entregado",
    color: "#7a6655",
    bg: "rgba(122,102,85,0.10)",
  },
];

function EstadoBadge({ estadoKey }) {
  const cfg = ESTADOS.find((e) => e.key === estadoKey) ?? ESTADOS[0];
  return (
    <span
      className="font-['JetBrains_Mono'] text-[9px] uppercase tracking-[0.18em] px-2.5 py-1"
      style={{
        color: cfg.color,
        background: cfg.bg,
        border: `1px solid ${cfg.color}55`,
      }}
    >
      {cfg.label}
    </span>
  );
}

function ProgressBar({ estadoKey }) {
  const idx = ESTADOS.findIndex((e) => e.key === estadoKey);
  return (
    <div className="flex items-center mt-2.5">
      {ESTADOS.map((e, i) => (
        <div key={e.key} className="flex items-center flex-1 last:flex-none">
          <div
            className="w-1.5 h-1.5 rounded-full flex-shrink-0 transition-all duration-500"
            style={{
              background: i <= idx ? "#9B2335" : "rgba(90,70,54,0.25)",
              boxShadow: i === idx ? "0 0 5px rgba(155,35,53,0.5)" : "none",
            }}
          />
          {i < ESTADOS.length - 1 && (
            <div
              className="h-px flex-1 transition-all duration-500"
              style={{
                background: i < idx ? "#9B233555" : "rgba(90,70,54,0.18)",
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
}

function PedidoCard({ pedido, index = 0 }) {
  const [abierto, setAbierto] = useState(index === 0);

  return (
    <article
      className="overflow-hidden"
      style={{
        background: "#e7caa9",
        animation: "pedidoFadeUp 0.4s ease both",
        animationDelay: `${index * 70}ms`,
      }}
    >
      {/* Cabecera */}
      <button
        onClick={() => setAbierto((v) => !v)}
        className="w-full flex items-start justify-between px-5 pt-5 pb-4 text-left transition-colors hover:bg-[#EAD9C6]"
      >
        <div className="flex-grow min-w-0">
          <div className="flex items-center gap-2.5 mb-2 flex-wrap">
            <span className="font-['JetBrains_Mono'] text-[9px] text-[#9a7f6a] tracking-[0.2em] uppercase">
              #{String(pedido.id).slice(-4).padStart(4, "0")}
            </span>
            <EstadoBadge estadoKey={pedido.estado} />
          </div>
          <p className="font-['EB_Garamond'] text-[17px] text-[#2f1f14] leading-tight">
            {SUCURSAL.nombre}
          </p>
          <p className="font-['DM_Sans'] text-[10px] text-[#9a7f6a] mt-0.5 truncate">
            {SUCURSAL.direccion}
          </p>
        </div>
        <div className="text-right flex-shrink-0 ml-4">
          <p className="font-['EB_Garamond'] text-2xl text-[#2f1f14]">
            ${pedido.total.toFixed(2)}
          </p>
          <p className="font-['JetBrains_Mono'] text-[9px] text-[#9a7f6a] mt-0.5 uppercase tracking-wider">
            {pedido.fecha}
          </p>
          <span
            className="font-['JetBrains_Mono'] text-[10px] text-[#9a7f6a] mt-1.5 inline-block transition-transform duration-300"
            style={{ transform: abierto ? "rotate(180deg)" : "rotate(0deg)" }}
          >
            ▾
          </span>
        </div>
      </button>

      {/* Barra de progreso */}
      <div
        className="px-5 pb-4"
        style={{ borderBottom: "1px solid rgba(90,70,54,0.12)" }}
      >
        <div className="flex justify-between mb-1">
          {ESTADOS.map((e) => {
            const idxActual = ESTADOS.findIndex((x) => x.key === pedido.estado);
            const i = ESTADOS.findIndex((x) => x.key === e.key);
            return (
              <span
                key={e.key}
                className="font-['JetBrains_Mono'] text-[8px] uppercase tracking-wider"
                style={{ color: e.color, opacity: i <= idxActual ? 1 : 0.3 }}
              >
                {e.label}
              </span>
            );
          })}
        </div>
        <ProgressBar estadoKey={pedido.estado} />
      </div>

      {/* Detalle colapsable */}
      <div
        style={{
          maxHeight: abierto ? "600px" : "0px",
          overflow: "hidden",
          transition: "max-height 0.4s ease",
        }}
      >
        <div className="px-5 py-4 space-y-2.5">
          {pedido.items.map((item) => (
            <div key={item.id} className="flex items-center gap-3">
              {item.imagen && (
                <img
                  src={item.imagen}
                  alt={item.nombre}
                  className="w-9 h-9 object-cover flex-shrink-0"
                  style={{ border: "1px solid rgba(90,70,54,0.2)" }}
                />
              )}
              <div className="flex-grow flex justify-between items-baseline min-w-0">
                <span className="font-['DM_Sans'] text-sm text-[#2f1f14] truncate pr-2">
                  {item.nombre}
                </span>
                <span className="font-['JetBrains_Mono'] text-[10px] text-[#9a7f6a] flex-shrink-0">
                  ×{item.cantidad}
                </span>
              </div>
              <span className="font-['JetBrains_Mono'] text-[11px] text-[#5a3e2b] flex-shrink-0 ml-2">
                ${(parseFloat(item.precio) * item.cantidad).toFixed(2)}
              </span>
            </div>
          ))}
          <div
            className="pt-3 mt-1 space-y-1"
            style={{ borderTop: "1px solid rgba(90,70,54,0.12)" }}
          >
            <div className="flex justify-between">
              <span className="font-['JetBrains_Mono'] text-[9px] text-[#9a7f6a] uppercase tracking-widest">
                Subtotal
              </span>
              <span className="font-['JetBrains_Mono'] text-[10px] text-[#5a3e2b]">
                ${pedido.subtotal.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-['JetBrains_Mono'] text-[9px] text-[#9a7f6a] uppercase tracking-widest">
                Servicio (10%)
              </span>
              <span className="font-['JetBrains_Mono'] text-[10px] text-[#5a3e2b]">
                ${pedido.servicio.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between pt-1.5">
              <span className="font-['JetBrains_Mono'] text-[10px] text-[#2f1f14] uppercase tracking-widest">
                Total
              </span>
              <span className="font-['EB_Garamond'] text-lg text-[#2f1f14]">
                ${pedido.total.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

export default PedidoCard;
