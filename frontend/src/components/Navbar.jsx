import logo from "../assets/logo.png";

const CATEGORIAS_BASE = ["Inicio", "Entradas"];
const CATEGORIAS_FINAL = ["Nuestras Sucursales"];

function Navbar({
  categoriaActiva,
  onCategoriaClick,
  totalItems,
  onCarritoClick,
  isLoggedIn,
}) {
  const categorias = isLoggedIn
    ? [...CATEGORIAS_BASE, "Pedidos", ...CATEGORIAS_FINAL]
    : [...CATEGORIAS_BASE, ...CATEGORIAS_FINAL];

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-16 py-5"
      style={{
        backgroundColor: "rgba(26, 26, 26, 0.95)",
        backdropFilter: "blur(12px)",
        opacity: 0,
        animation: "slideUp 0.6s ease-out 0.3s forwards",
      }}
    >
      {/* Logo */}
      <div
        className="flex items-center gap-3"
        style={{
          opacity: 0,
          animation: "fadeIn 0.5s ease-out 0.6s forwards",
        }}
      >
        <img src={logo} alt="Casablanca" className="w-10 h-10 object-contain" />
        <div className="flex flex-col">
          <span className="font-['EB_Garamond'] text-[18px] tracking-widest uppercase text-[#D4AF6A]">
            Casablanca
          </span>
          <span className="font-['JetBrains_Mono'] text-[9px] text-[#F2EDE4]/50 tracking-widest">
            EST. 1981
          </span>
        </div>
      </div>

      {/* Categorías — cada item con delay escalonado */}
      <ul className="flex items-center gap-8">
        {categorias.map((cat, i) => {
          const activa = cat === categoriaActiva;
          return (
            <li
              key={cat}
              onClick={() => onCategoriaClick(cat)}
              className={`font-['DM_Sans'] text-[12px] uppercase tracking-widest cursor-pointer transition-colors pb-1
                ${
                  activa
                    ? "text-[#D4AF6A] border-b border-[#D4AF6A]"
                    : "text-[#F2EDE4]/70 hover:text-[#D4AF6A]"
                }`}
              style={{
                opacity: 0,
                animation: `fadeIn 0.4s ease-out ${0.7 + i * 0.1}s forwards`,
              }}
            >
              {cat}
            </li>
          );
        })}
      </ul>

      {/* Carrito */}
      {isLoggedIn && categoriaActiva === "Entradas" ? (
        <div
          onClick={onCarritoClick}
          className="flex items-center gap-2 cursor-pointer group"
          style={{
            opacity: 0,
            animation: "fadeIn 0.5s ease-out 1.1s forwards",
          }}
        >
          <div className="relative">
            <span className="material-symbols-outlined text-[#F2EDE4]/70 group-hover:text-[#D4AF6A] transition-colors">
              shopping_bag
            </span>
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 w-4 h-4 bg-[#9B2335] rounded-full flex items-center justify-center font-['JetBrains_Mono'] text-[9px] text-white">
                {totalItems}
              </span>
            )}
          </div>
          <span className="font-['JetBrains_Mono'] text-[11px] text-[#F2EDE4]/70 group-hover:text-[#D4AF6A] transition-colors uppercase tracking-widest">
            Carrito
          </span>
        </div>
      ) : (
        <div className="w-[80px]" />
      )}
    </nav>
  );
}

export default Navbar;
