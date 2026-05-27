import { useState } from "react";

const SUCURSAL = {
  nombre: "Sucursal Centro",
  direccion: "Macedonio Alcalá 402, Centro Histórico",
};

function PedidoCard({ pedido, index = 0 }) {
  const [abierto, setAbierto] = useState(index === 0);

  return (
    <article
      style={{
        background:
          "linear-gradient(145deg, #F4EFE8 0%, #E7D9C8 60%, #DDCBB7 100%)",
        borderRadius: "16px",
        overflow: "hidden",
        boxShadow:
          "0 4px 20px rgba(90,54,24,0.13), 0 1px 4px rgba(90,54,24,0.08), inset 0 1px 0 rgba(255,255,255,0.6)",
        opacity: 0,
        animation: "pedidoFadeUp 0.4s ease both",
        animationDelay: `${index * 70}ms`,
        border: "1px solid rgba(160,135,110,0.3)",
      }}
    >
      {/* Cabecera */}
      <button
        onClick={() => setAbierto((v) => !v)}
        className="w-full text-left transition-all duration-200"
        style={{ background: "transparent", padding: "18px 20px 14px" }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.background = "rgba(90,54,24,0.04)")
        }
        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
      >
        {/* Fila 1: titulo + fecha + chevron */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span
              className="font-['EB_Garamond'] text-[16px]"
              style={{ color: "#2B1B12" }}
            >
              Pedido
            </span>
            <span
              className="w-1.5 h-1.5 rounded-full flex-shrink-0"
              style={{
                background: "rgba(90, 70, 54, 0.5)",
                boxShadow: "0 0 0 3px rgba(90, 70, 54, 0.2)",
              }}
            />
          </div>
          <div className="flex items-center gap-3">
            <p
              className="font-['DM_Sans'] text-[9px] uppercase tracking-wider"
              style={{ color: "rgba(35, 25, 20, 0.6)" }}
            >
              {pedido.fecha}
            </p>
            <span
              className="font-['DM_Sans'] text-[11px] transition-transform duration-300 inline-block"
              style={{
                color: "rgba(20, 18, 16, 0.55)",
                transform: abierto ? "rotate(180deg)" : "rotate(0deg)",
              }}
            >
              ▾
            </span>
          </div>
        </div>

        {/* Fila 2: pedido # + sucursal */}
        <div className="flex items-end justify-between gap-3">
          <div className="min-w-0">
            <p
              className="font-['DM_Sans'] text-[10px] uppercase tracking-[0.28em]"
              style={{ color: "rgba(20, 18, 16, 0.55)" }}
            >
              Pedido #{String(pedido.id).slice(-4).padStart(4, "0")}
            </p>
            <p
              className="font-['DM_Sans'] leading-none mt-2 font-medium"
              style={{
                fontSize: "16px",
                color: "#2B1B12",
                letterSpacing: "-0.01em",
              }}
            >
              {SUCURSAL.nombre}
            </p>
          </div>
          <div className="text-right flex-shrink-0">
            <p
              className="font-['DM_Sans'] text-[10px]"
              style={{ color: "rgba(35, 25, 20, 0.6)" }}
            >
              {SUCURSAL.direccion}
            </p>
          </div>
        </div>
      </button>

      {/* Detalle colapsable */}
      <div
        style={{
          maxHeight: abierto ? "600px" : "0px",
          overflow: "hidden",
          transition: "max-height 0.4s cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        <div
          className="mx-5 mb-3"
          style={{
            height: "1px",
            background:
              "linear-gradient(90deg, transparent, rgba(110,90,70,0.45) 20%, rgba(110,90,70,0.45) 80%, transparent)",
          }}
        />
        <div className="mx-5 mb-3 flex items-center gap-3">
          <span
            className="font-['DM_Sans'] text-[9px] uppercase tracking-[0.35em]"
            style={{ color: "rgba(30, 20, 16, 0.7)" }}
          >
            Ordenes
          </span>
          <div
            className="flex-1 h-px"
            style={{
              background:
                "linear-gradient(90deg, rgba(110,90,70,0.7), rgba(110,90,70,0.25) 70%, transparent)",
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
                  className="font-['DM_Sans'] text-[9px] flex-shrink-0"
                  style={{ color: "rgba(35, 25, 20, 0.65)" }}
                >
                  ×{item.cantidad}
                </span>
              </div>
              <span
                className="font-['DM_Sans'] text-[11px] flex-shrink-0"
                style={{ color: "#4A1F1F" }}
              >
                ${(parseFloat(item.precio) * item.cantidad).toFixed(2)}
              </span>
            </div>
          ))}

          <div
            className="pt-3 mt-1"
            style={{ borderTop: "1px dashed rgba(110,90,70,0.55)" }}
          >
            <div className="flex justify-between mb-1">
              <span
                className="font-['DM_Sans'] text-[9px] uppercase tracking-widest"
                style={{ color: "rgba(35, 25, 20, 0.65)" }}
              >
                Subtotal
              </span>
              <span
                className="font-['DM_Sans'] text-[10px]"
                style={{ color: "#4A1F1F" }}
              >
                ${pedido.subtotal.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between mb-2">
              <span
                className="font-['DM_Sans'] text-[9px] uppercase tracking-widest"
                style={{ color: "rgba(35, 25, 20, 0.65)" }}
              >
                Servicio (10%)
              </span>
              <span
                className="font-['DM_Sans'] text-[10px]"
                style={{ color: "#4A1F1F" }}
              >
                ${pedido.servicio.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pedidoFadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </article>
  );
}

export default PedidoCard;
