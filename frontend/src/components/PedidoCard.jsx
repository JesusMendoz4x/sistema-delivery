import { useState } from "react";

const SUCURSAL = {
  nombre: "Sucursal Centro",
  direccion: "Macedonio Alcalá 402, Centro Histórico",
};

export const ESTADOS = [
  {
    key: "pendiente",
    label: "Pendiente",
    color: "#C8901A",
    bg: "rgba(200,144,26,0.12)",
  },
  {
    key: "en_preparacion",
    label: "En preparación",
    color: "#9B2335",
    bg: "rgba(155,35,53,0.12)",
  },
  {
    key: "listo",
    label: "Listo",
    color: "#2D7A4F",
    bg: "rgba(45,122,79,0.12)",
  },
  {
    key: "entregado",
    label: "Entregado",
    color: "#7a6655",
    bg: "rgba(122,102,85,0.12)",
  },
];

function PedidoCard({ pedido, index = 0 }) {
  const [abierto, setAbierto] = useState(index === 0);
  const estadoCfg = ESTADOS.find((e) => e.key === pedido.estado) ?? ESTADOS[0];
  const idxActual = ESTADOS.findIndex((e) => e.key === pedido.estado);

  return (
    <article
      style={{
        background:
          "linear-gradient(145deg, #F4EFE8 0%, #E7D9C8 60%, #DDCBB7 100%)",
        borderRadius: "16px",
        overflow: "hidden",
        boxShadow:
          "0 4px 20px rgba(90,54,24,0.13), 0 1px 4px rgba(90,54,24,0.08), inset 0 1px 0 rgba(255,255,255,0.6)",
        animation: "pedidoFadeUp 0.4s ease both",
        animationDelay: `${index * 70}ms`,
        border: "1px solid rgba(160,135,110,0.3)",
      }}
    >
      {/* ── Cabecera ── */}
      <button
        onClick={() => setAbierto((v) => !v)}
        className="w-full text-left transition-all duration-200"
        style={{ background: "transparent", padding: "18px 20px 14px" }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.background = "rgba(90,54,24,0.04)")
        }
        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
      >
        {/* Fila 1: ID + dot de estado + chevron */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <span
              className="font-['JetBrains_Mono'] text-[9px] tracking-[0.28em] uppercase"
              style={{ color: "rgba(20, 18, 16, 0.55)" }}
            >
              #{String(pedido.id).slice(-4).padStart(4, "0")}
            </span>
            {/* Solo el dot — sin texto */}
            <span
              className="w-1.5 h-1.5 rounded-full flex-shrink-0"
              style={{
                background: estadoCfg.color,
                boxShadow:
                  pedido.estado !== "entregado"
                    ? `0 0 0 3px ${estadoCfg.color}28`
                    : "none",
                animation:
                  pedido.estado === "en_preparacion"
                    ? "pulse 1.8s ease infinite"
                    : "none",
              }}
            />
          </div>
          <span
            className="font-['JetBrains_Mono'] text-[11px] transition-transform duration-300 inline-block"
            style={{
              color: "rgba(20, 18, 16, 0.55)",
              transform: abierto ? "rotate(180deg)" : "rotate(0deg)",
            }}
          >
            ▾
          </span>
        </div>

        {/* Fila 2: sucursal + total */}
        <div className="flex items-end justify-between gap-3">
          <div className="min-w-0">
            {/* Nombre en marrón oscuro cálido y prominente */}
            <p
              className="font-['EB_Garamond'] leading-none mb-1.5"
              style={{
                fontSize: "22px",
                color: "#2B1B12",
                letterSpacing: "-0.02em",
                fontFamily: "'Cinzel', 'EB Garamond', serif",
              }}
            >
              {SUCURSAL.nombre}
            </p>
            {/* Dirección muy tenue */}
            <p
              className="font-['DM_Sans'] text-[10px] truncate"
              style={{ color: "rgba(35, 25, 20, 0.6)" }}
            >
              {SUCURSAL.direccion}
            </p>
          </div>
          <div className="text-right flex-shrink-0">
            <p
              className="font-['JetBrains_Mono'] text-[9px] mt-1 uppercase tracking-wider"
              style={{ color: "rgba(35, 25, 20, 0.6)" }}
            >
              {pedido.fecha}
            </p>
          </div>
        </div>
      </button>

      {/* ── Separador con motivo decorativo ── */}
      <div
        className="relative flex items-center px-5 py-0"
        style={{ marginBottom: "0" }}
      >
        <div
          className="flex-1 h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(140,120,95,0.25) 30%, rgba(140,120,95,0.25) 70%, transparent)",
          }}
        />
        <div
          className="mx-3 flex gap-1"
          style={{
            color: "rgba(140,120,95,0.3)",
            fontSize: "7px",
            letterSpacing: "3px",
          }}
        >
          ✦ ✦ ✦
        </div>
        <div
          className="flex-1 h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(140,120,95,0.25) 30%, rgba(140,120,95,0.25) 70%, transparent)",
          }}
        />
      </div>

      {/* ── Barra de progreso ── */}
      <div className="px-5 py-3">
        {/* Labels */}
        <div className="flex justify-between mb-2">
          {ESTADOS.map((e, i) => (
            <span
              key={e.key}
              className="font-['JetBrains_Mono'] text-[8px] uppercase tracking-wide"
              style={{ color: e.color, opacity: i <= idxActual ? 1 : 0.25 }}
            >
              {e.label}
            </span>
          ))}
        </div>
        {/* Track */}
        <div className="flex items-center">
          {ESTADOS.map((e, i) => (
            <div
              key={e.key}
              className="flex items-center flex-1 last:flex-none"
            >
              <div
                className="w-2.5 h-2.5 rounded-full flex-shrink-0 transition-all duration-500"
                style={{
                  background:
                    i <= idxActual ? estadoCfg.color : "rgba(140,120,95,0.15)",
                  border:
                    i === idxActual
                      ? `2px solid ${estadoCfg.color}`
                      : "2px solid transparent",
                  boxShadow:
                    i === idxActual ? `0 0 8px ${estadoCfg.color}77` : "none",
                  transform: i === idxActual ? "scale(1.25)" : "scale(1)",
                }}
              />
              {i < ESTADOS.length - 1 && (
                <div
                  className="h-0.5 flex-1 transition-all duration-500 rounded-full"
                  style={{
                    background:
                      i < idxActual
                        ? `${estadoCfg.color}66`
                        : "rgba(140,120,95,0.12)",
                  }}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── Detalle colapsable ── */}
      <div
        style={{
          maxHeight: abierto ? "600px" : "0px",
          overflow: "hidden",
          transition: "max-height 0.4s cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        {/* Separador antes del detalle */}
        <div
          className="mx-5 mb-3"
          style={{
            height: "1px",
            background:
              "linear-gradient(90deg, transparent, rgba(140,120,95,0.2) 20%, rgba(140,120,95,0.2) 80%, transparent)",
          }}
        />

        <div className="mx-5 mb-3 flex items-center gap-3">
          <span
            className="text-[9px] uppercase tracking-[0.35em]"
            style={{
              color: "rgba(30, 20, 16, 0.7)",
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            Ordenes
          </span>
          <div
            className="flex-1 h-px"
            style={{
              background:
                "linear-gradient(90deg, rgba(140,120,95,0.45), rgba(140,120,95,0.15) 70%, transparent)",
            }}
          />
        </div>

        <div className="px-5 pb-5 space-y-2">
          {pedido.items.map((item) => (
            <div key={item.id} className="flex items-center gap-3">
              {item.imagen && (
                <img
                  src={item.imagen}
                  alt={item.nombre}
                  className="w-8 h-8 object-cover flex-shrink-0"
                  style={{
                    borderRadius: "6px",
                    border: "1px solid rgba(140,120,95,0.2)",
                  }}
                />
              )}
              <div className="flex-grow flex justify-between items-baseline min-w-0 gap-2">
                <span
                  className="font-['DM_Sans'] text-[13px] truncate"
                  style={{ color: "#2B1B12" }}
                >
                  {item.nombre}
                </span>
                <span
                  className="font-['JetBrains_Mono'] text-[9px] flex-shrink-0"
                  style={{ color: "rgba(35, 25, 20, 0.65)" }}
                >
                  ×{item.cantidad}
                </span>
              </div>
              <span
                className="font-['JetBrains_Mono'] text-[11px] flex-shrink-0"
                style={{ color: "#4A1F1F" }}
              >
                ${(parseFloat(item.precio) * item.cantidad).toFixed(2)}
              </span>
            </div>
          ))}

          {/* Totales con separador punteado */}
          <div
            className="pt-3 mt-1"
            style={{ borderTop: "1px dashed rgba(140,120,95,0.25)" }}
          >
            <div className="flex justify-between mb-1">
              <span
                className="font-['JetBrains_Mono'] text-[9px] uppercase tracking-widest"
                style={{ color: "rgba(35, 25, 20, 0.65)" }}
              >
                Subtotal
              </span>
              <span
                className="font-['JetBrains_Mono'] text-[10px]"
                style={{ color: "#4A1F1F" }}
              >
                ${pedido.subtotal.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between mb-2">
              <span
                className="font-['JetBrains_Mono'] text-[9px] uppercase tracking-widest"
                style={{ color: "rgba(35, 25, 20, 0.65)" }}
              >
                Servicio (10%)
              </span>
              <span
                className="font-['JetBrains_Mono'] text-[10px]"
                style={{ color: "#4A1F1F" }}
              >
                ${pedido.servicio.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.6; transform: scale(0.85); }
        }
      `}</style>
    </article>
  );
}

export default PedidoCard;
