import { useState } from "react";

const SUCURSAL = {
  nombre: "Sucursal Centro",
  direccion: "Macedonio Alcalá 402, Centro Histórico",
};

const ESTADOS = [
  { key: "pendiente", label: "Pendiente" },
  { key: "preparando", label: "En preparación" },
  { key: "en_camino", label: "En camino" },
  { key: "entregado", label: "Entregado" },
];

function PedidoCard({ pedido, index = 0 }) {
  const [abierto, setAbierto] = useState(index === 0);
  const idxActual = ESTADOS.findIndex((e) => e.key === pedido.estado);

  const items = pedido.items || pedido.productos || [];
  const subtotal = pedido.subtotal || items.reduce((acc, item) => acc + parseFloat(item.precio || item.precioUnitario || 0) * item.cantidad, 0);
  const servicio = pedido.servicio || (subtotal * 0.1);
  const total = pedido.total || (subtotal + servicio);

  return (
    <article
      style={{
        background: "rgba(242, 237, 228, 0.06)",
        borderRadius: "16px",
        overflow: "hidden",
        boxShadow: "0 8px 24px rgba(0,0,0,0.38), 0 2px 6px rgba(0,0,0,0.24)",
        opacity: 0,
        animation: "pedidoFadeUp 0.4s ease both",
        animationDelay: `${index * 70}ms`,
        border: "1px solid rgba(212, 175, 106, 0.2)",
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
              className="font-['DM_Sans'] text-[14px] uppercase tracking-[0.2em]"
              style={{ color: "#F2EDE4" }}
            >
              Pedido
            </span>
            <span
              className="w-1.5 h-1.5 rounded-full flex-shrink-0"
              style={{
                background: "#D4AF6A",
                boxShadow: "0 0 0 3px rgba(212, 175, 106, 0.2)",
              }}
            />
          </div>
          <div className="flex items-center gap-3">
            <p
              className="font-['DM_Sans'] text-[9px] uppercase tracking-wider"
              style={{ color: "rgba(242, 237, 228, 0.7)" }}
            >
              {pedido.fecha || (pedido.createdAt ? new Date(pedido.createdAt).toLocaleDateString() : '')}
            </p>
            <span
              className="font-['DM_Sans'] text-[11px] transition-transform duration-300 inline-block"
              style={{
                color: "rgba(242, 237, 228, 0.8)",
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
              style={{ color: "rgba(242, 237, 228, 0.6)" }}
            >
              Pedido #{String(pedido._id || pedido.id || '').slice(-4).padStart(4, "0")}
            </p>
            <p
              className="font-['DM_Sans'] leading-none mt-2 font-medium"
              style={{
                fontSize: "16px",
                color: "#F2EDE4",
                letterSpacing: "-0.01em",
              }}
            >
              {SUCURSAL.nombre}
            </p>
          </div>
          <div className="text-right flex-shrink-0">
            <p
              className="font-['DM_Sans'] text-[10px]"
              style={{ color: "rgba(242, 237, 228, 0.6)" }}
            >
              {SUCURSAL.direccion}
            </p>
          </div>
        </div>
      </button>

      {/* Barra de progreso */}
      <div className="px-5 pb-4">
        <div className="flex justify-between mb-2">
          {ESTADOS.map((e, i) => {
            const done = i < idxActual;
            const activo = i === idxActual;
            return (
              <span
                key={e.key}
                className="font-['DM_Sans'] text-[8px] uppercase tracking-wide"
                style={{
                  color: done
                    ? "#D4AF6A"
                    : activo
                      ? "#9B2335"
                      : "rgba(212, 175, 106, 0.4)",
                }}
              >
                {e.label}
              </span>
            );
          })}
        </div>
        <div className="flex items-center">
          {ESTADOS.map((e, i) => {
            const done = i < idxActual;
            const activo = i === idxActual;
            return (
              <div
                key={e.key}
                className="flex items-center flex-1 last:flex-none"
              >
                <div
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0 transition-all duration-500"
                  style={{
                    background: done
                      ? "#D4AF6A"
                      : activo
                        ? "#9B2335"
                        : "rgba(212, 175, 106, 0.15)",
                    border: activo
                      ? "2px solid #9B2335"
                      : "2px solid transparent",
                    boxShadow: activo
                      ? "0 0 8px rgba(155, 35, 53, 0.55)"
                      : "none",
                    transform: activo ? "scale(1.25)" : "scale(1)",
                  }}
                />
                {i < ESTADOS.length - 1 && (
                  <div
                    className="h-0.5 flex-1 transition-all duration-500 rounded-full"
                    style={{
                      background: done
                        ? "rgba(212, 175, 106, 0.8)"
                        : activo
                          ? "rgba(155, 35, 53, 0.55)"
                          : "rgba(212, 175, 106, 0.15)",
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

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
              "linear-gradient(90deg, transparent, rgba(212,175,106,0.25) 20%, rgba(212,175,106,0.25) 80%, transparent)",
          }}
        />
        <div className="mx-5 mb-3 flex items-center gap-3">
          <span
            className="font-['DM_Sans'] text-[9px] uppercase tracking-[0.35em]"
            style={{ color: "rgba(242, 237, 228, 0.65)" }}
          >
            Ordenes
          </span>
          <div
            className="flex-1 h-px"
            style={{
              background:
                "linear-gradient(90deg, rgba(212,175,106,0.6), rgba(212,175,106,0.2) 70%, transparent)",
            }}
          />
        </div>

        <div className="px-5 pb-5 space-y-2">
          {items.map((item) => (
            <div key={item.id || item.productoId || item._id} className="flex items-center gap-3">
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
                  style={{ color: "#F2EDE4" }}
                >
                  {item.nombre}
                </span>
                <span
                  className="font-['DM_Sans'] text-[9px] flex-shrink-0"
                  style={{ color: "rgba(242, 237, 228, 0.65)" }}
                >
                  ×{item.cantidad}
                </span>
              </div>
              <span
                className="font-['DM_Sans'] text-[11px] flex-shrink-0"
                style={{ color: "#D4AF6A" }}
              >
                ${(parseFloat(item.precio || item.precioUnitario || 0) * item.cantidad).toFixed(2)}
              </span>
            </div>
          ))}

          <div
            className="pt-3 mt-1"
            style={{ borderTop: "1px dashed rgba(212, 175, 106, 0.3)" }}
          >
            <div className="flex justify-between mb-1">
              <span
                className="font-['DM_Sans'] text-[9px] uppercase tracking-widest"
                style={{ color: "rgba(242, 237, 228, 0.65)" }}
              >
                Subtotal
              </span>
              <span
                className="font-['DM_Sans'] text-[10px]"
                style={{ color: "#D4AF6A" }}
              >
                ${subtotal.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between mb-2">
              <span
                className="font-['DM_Sans'] text-[9px] uppercase tracking-widest"
                style={{ color: "rgba(242, 237, 228, 0.65)" }}
              >
                Servicio (10%)
              </span>
              <span
                className="font-['DM_Sans'] text-[10px]"
                style={{ color: "#D4AF6A" }}
              >
                ${servicio.toFixed(2)}
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
