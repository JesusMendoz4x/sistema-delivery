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
        className="w-16 h-16 bg-surface-container overflow-hidden flex-shrink-0"
        style={{ border: "1px solid rgba(212, 175, 106, 0.25)" }}
      >
        <img
          src={imagen}
          alt={nombre}
          className="w-full h-full object-cover grayscale-[0.5]"
        />
      </div>
      <div className="flex-grow">
        <div className="flex justify-between items-start">
          <h4 className="font-['DM_Sans'] text-sm font-semibold uppercase tracking-wide">
            {nombre}
          </h4>
          <span className="font-['JetBrains_Mono'] text-secondary text-[11px]">
            ${precio}
          </span>
        </div>
        <div className="flex items-center gap-3 mt-2">
          <button
            onClick={onDecrementar}
            className="w-5 h-5 border border-secondary/30 flex items-center justify-center text-[10px] hover:border-secondary transition-colors"
          >
            -
          </button>
          <span className="font-['JetBrains_Mono'] text-[11px]">
            {String(cantidad).padStart(2, "0")}
          </span>
          <button
            onClick={onIncrementar}
            className="w-5 h-5 border border-secondary/30 flex items-center justify-center text-[10px] hover:border-secondary transition-colors"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}

function CartPanel({ items, onIncrementar, onDecrementar, onConfirmar }) {
  const subtotal = items.reduce(
    (acc, item) => acc + parseFloat(item.precio) * item.cantidad,
    0,
  );
  const servicio = subtotal * 0.1;
  const total = subtotal + servicio;

  return (
    <aside className="fixed right-0 top-0 h-full w-[350px] bg-background border-l border-secondary/25 flex flex-col z-50">
      {/* Header */}
      <div className="p-8 border-b border-secondary/10">
        <div className="flex justify-between items-center">
          <h2 className="font-['EB_Garamond'] text-2xl uppercase tracking-tighter">
            Tu Orden
          </h2>
          <span className="material-symbols-outlined text-secondary">
            shopping_bag
          </span>
        </div>
      </div>

      {/* Items */}
      <div className="flex-grow overflow-y-auto p-8 space-y-6">
        {items.length === 0 ? (
          <p className="font-['DM_Sans'] text-sm text-on-surface-variant text-center mt-8">
            Tu orden está vacía
          </p>
        ) : (
          <>
            {items.map((item) => (
              <CartItem
                key={item.id}
                {...item}
                onIncrementar={() => onIncrementar(item.id)}
                onDecrementar={() => onDecrementar(item.id)}
              />
            ))}
            <div className="pt-6 mt-6 border-t border-secondary/10">
              <div className="flex justify-between items-center mb-2">
                <span className="font-['JetBrains_Mono'] text-[10px] text-on-surface-variant uppercase tracking-widest">
                  Subtotal
                </span>
                <span className="font-['JetBrains_Mono'] text-[11px]">
                  ${subtotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="font-['JetBrains_Mono'] text-[10px] text-on-surface-variant uppercase tracking-widest">
                  Servicio (10%)
                </span>
                <span className="font-['JetBrains_Mono'] text-[11px]">
                  ${servicio.toFixed(2)}
                </span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Footer */}
      <div className="p-8 bg-surface-container-low border-t border-secondary/25">
        <div className="flex justify-between items-baseline mb-6">
          <span className="font-['JetBrains_Mono'] text-xs uppercase tracking-[0.2em]">
            Total
          </span>
          <span className="font-['EB_Garamond'] text-3xl text-primary">
            ${total.toFixed(2)}
          </span>
        </div>
        <button
          onClick={onConfirmar}
          className="w-full bg-primary py-4 px-6 font-['JetBrains_Mono'] text-sm uppercase tracking-[0.3em] hover:bg-primary-container transition-all active:scale-[0.98] text-surface"
        >
          Confirmar Pedido
        </button>
        <p className="mt-4 text-[10px] font-['JetBrains_Mono'] text-center text-on-surface-variant/60 uppercase tracking-widest">
          Precio incluye impuestos locales
        </p>
      </div>
    </aside>
  );
}

export default CartPanel;
