import { createPortal } from "react-dom";

function CartItem({
  nombre,
  precio,
  imagen,
  cantidad,
  onIncrementar,
  onDecrementar,
}) {
  return (
    <div className="flex gap-4 items-start">
      <div
        className="w-16 h-16 overflow-hidden flex-shrink-0"
        style={{
          border: "1px solid rgba(226, 227, 230, 0.18)",
          background: "rgba(24, 24, 28, 0.9)",
        }}
      >
        <img src={imagen} alt={nombre} className="w-full h-full object-cover" />
      </div>
      <div className="flex-grow">
        <div className="flex justify-between items-start">
          <h4 className="font-['DM_Sans'] text-sm font-semibold text-[#F2F2F4]">
            {nombre}
          </h4>
          <span className="font-['DM_Sans'] text-[12px] text-[#C9CBD3]">
            ${precio}
          </span>
        </div>
        <div className="flex items-center gap-3 mt-2">
          <button
            onClick={onDecrementar}
            className="w-6 h-6 flex items-center justify-center text-[12px] transition-colors"
            style={{
              border: "1px solid rgba(226, 227, 230, 0.25)",
              color: "#E2E3E6",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.borderColor = "rgba(226, 227, 230, 0.5)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.borderColor = "rgba(226, 227, 230, 0.25)")
            }
          >
            -
          </button>
          <span className="font-['DM_Sans'] text-[12px] text-[#E2E3E6]">
            {String(cantidad).padStart(2, "0")}
          </span>
          <button
            onClick={onIncrementar}
            className="w-6 h-6 flex items-center justify-center text-[12px] transition-colors"
            style={{
              border: "1px solid rgba(226, 227, 230, 0.25)",
              color: "#E2E3E6",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.borderColor = "rgba(226, 227, 230, 0.5)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.borderColor = "rgba(226, 227, 230, 0.25)")
            }
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}

function CartPanel({
  items,
  onIncrementar,
  onDecrementar,
  onConfirmar,
  onClose,
}) {
  if (typeof document === "undefined") return null;

  const subtotal = items.reduce(
    (acc, item) => acc + parseFloat(item.precio) * item.cantidad,
    0,
  );
  const servicio = subtotal * 0.1;
  const total = subtotal + servicio;

  return createPortal(
    <aside
      className="fixed right-0 top-0 w-[350px] text-[#F2F2F4] border-l border-white/10 flex flex-col z-40"
      style={{
        height: "100vh",
        overscrollBehavior: "contain",
        background:
          "linear-gradient(180deg, rgba(18, 18, 22, 0.98) 0%, rgba(12, 12, 16, 0.98) 100%)",
      }}
    >
      {/* Header — siempre visible */}
      <div className="p-8 border-b border-white/10 flex-shrink-0">
        <div className="flex justify-between items-center">
          <h2 className="font-['DM_Sans'] text-2xl font-semibold">Tu Orden</h2>
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[#D95F5F]">
              shopping_bag
            </span>
            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar carrito"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 text-[#E2E3E6] transition-colors"
              onMouseEnter={(e) =>
                (e.currentTarget.style.borderColor = "rgba(226, 227, 230, 0.4)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.borderColor =
                  "rgba(226, 227, 230, 0.15)")
              }
            >
              &times;
            </button>
          </div>
        </div>
      </div>

      {/* Items — único área con scroll propio, aislado de la página */}
      <div className="flex-grow overflow-y-auto p-8 space-y-6">
        {items.length === 0 ? (
          <p className="font-['DM_Sans'] text-sm text-[#B9BBC3] text-center mt-8">
            Tu orden está vacía
          </p>
        ) : (
          <>
            {items.map((item) => {
              const itemId = item._id || item.id;
              return (
                <CartItem
                  key={itemId}
                  {...item}
                  onIncrementar={() => onIncrementar(itemId)}
                  onDecrementar={() => onDecrementar(itemId)}
                />
              );
            })}
            <div className="pt-6 mt-6 border-t border-white/10">
              <div className="flex justify-between items-center mb-2">
                <span className="font-['DM_Sans'] text-[12px] text-[#B9BBC3]">
                  Subtotal
                </span>
                <span className="font-['DM_Sans'] text-[12px] text-[#E2E3E6]">
                  ${subtotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="font-['DM_Sans'] text-[12px] text-[#B9BBC3]">
                  Servicio (10%)
                </span>
                <span className="font-['DM_Sans'] text-[12px] text-[#E2E3E6]">
                  ${servicio.toFixed(2)}
                </span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Footer — siempre visible al fondo */}
      <div className="p-8 bg-[#141418] border-t border-white/10 flex-shrink-0">
        <div className="flex justify-between items-baseline mb-6">
          <span className="font-['DM_Sans'] text-[12px] text-[#B9BBC3]">
            Total
          </span>
          <span className="font-['DM_Sans'] text-3xl font-semibold text-[#F2F2F4]">
            ${total.toFixed(2)}
          </span>
        </div>
        <button
          onClick={onConfirmar}
          className="w-full py-4 px-6 font-['DM_Sans'] text-sm font-semibold transition-all active:scale-[0.98]"
          style={{ backgroundColor: "#D95F5F", color: "#0B0B0E" }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "#E57474")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "#D95F5F")
          }
        >
          Confirmar Pedido
        </button>
        <p className="mt-4 text-[11px] font-['DM_Sans'] text-center text-[#9EA0A8]">
          Precio incluye impuestos locales
        </p>
      </div>
    </aside>,
    document.body,
  );
}

export default CartPanel;
