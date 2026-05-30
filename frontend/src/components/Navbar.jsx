import { useEffect, useRef, useState } from "react";
import logo from "../assets/logo.png";
import { useAuth } from "../context/AuthContext";

const CATEGORIAS_BASE = ["Inicio", "Entradas"];
const CATEGORIAS_FINAL = ["Nuestras Sucursales"];

function Navbar({
  categoriaActiva,
  onCategoriaClick,
  totalItems,
  onCarritoClick,
  carritoAnimado = false,
  mostrarMenu = false,
}) {
  const iconoRef = useRef(null);
  const dropdownRef = useRef(null);
  const { isLoggedIn, user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);

  // Dispara la animación bounce cada vez que carritoAnimado cambia a true
  useEffect(() => {
    if (!carritoAnimado || !iconoRef.current) return;
    const el = iconoRef.current;
    el.style.animation = "none";
    // fuerza reflow para reiniciar la animación
    void el.offsetWidth;
    el.style.animation = "cartBounce 0.4s ease forwards";
  }, [carritoAnimado]);

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

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
        style={{ opacity: 0, animation: "fadeIn 0.5s ease-out 0.6s forwards" }}
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

      {/* Categorías */}
      <ul className="flex items-center gap-8 font-light select-none">
        {categorias.map((cat, i) => {
          const activa = cat === categoriaActiva;
          return (
            <li
              key={cat}
              onClick={() => onCategoriaClick(cat)}
              className={`font-['DM_Sans'] text-[12px] uppercase tracking-widest cursor-pointer transition-colors pb-1
                ${activa ? "text-[#D4AF6A] border-b border-[#D4AF6A]" : "text-[#F2EDE4]/70 hover:text-[#D4AF6A]"}`}
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

      {/* Lado Derecho: Carrito + Perfil */}
      <div 
        className="flex items-center gap-6" 
        style={{ 
          opacity: 0, 
          animation: "fadeIn 0.5s ease-out 1.1s forwards" 
        }}
      >
        {/* Carrito */}
        {isLoggedIn && (categoriaActiva === "Entradas" || mostrarMenu) && (
          <div
            onClick={onCarritoClick}
            className="flex items-center gap-2 cursor-pointer group mr-2 select-none"
          >
            <div className="relative">
              <span
                id="carrito-icono-nav"
                ref={iconoRef}
                className="material-symbols-outlined text-[#F2EDE4]/70 group-hover:text-[#D4AF6A] transition-colors inline-block"
              >
                shopping_bag
              </span>
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 w-4 h-4 bg-[#9B2335] rounded-full flex items-center justify-center font-['JetBrains_Mono'] text-[9px] text-white">
                  {totalItems}
                </span>
              )}
            </div>
            <span className="font-['JetBrains_Mono'] text-[11px] text-[#F2EDE4]/70 group-hover:text-[#D4AF6A] transition-colors uppercase tracking-widest font-normal">
              Carrito
            </span>
          </div>
        )}

        {/* Divisor si está logueado y en entradas */}
        {isLoggedIn && (categoriaActiva === "Entradas" || mostrarMenu) && (
          <div className="w-px h-6 bg-[#D4AF6A]/20" />
        )}

        {/* Perfil del Cliente */}
        {isLoggedIn ? (
          <div className="relative" ref={dropdownRef}>
            <div 
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-4 cursor-pointer hover:opacity-90 select-none group"
            >
              <div className="text-right hidden sm:block">
                <p className="font-['JetBrains_Mono'] text-[10px] tracking-[0.2em] uppercase text-[#D4AF6A] group-hover:text-white transition-colors font-semibold">
                  {user?.nombre || "CLIENTE"}
                </p>
                <p className="text-[11px] text-[#F2EDE4]/40 font-['Nunito'] mt-0.5 max-w-[150px] truncate">
                  {user?.email}
                </p>
              </div>
              <div className="w-10 h-10 rounded-full bg-[#141414] border border-[#D4AF6A]/30 group-hover:border-[#D4AF6A] flex items-center justify-center text-[#D4AF6A] font-['Outfit'] shadow-[0_4px_10px_rgba(0,0,0,0.5)] transition-colors">
                {user?.nombre ? user.nombre.charAt(0).toUpperCase() : "C"}
              </div>
            </div>

            {/* Dropdown Menu */}
            {showDropdown && (
              <div 
                className="absolute right-0 mt-3 w-48 bg-[#141414]/95 border border-[#D4AF6A]/20 rounded-xl py-2 shadow-[0_10px_30px_rgba(0,0,0,0.5)] backdrop-blur-md z-[60]"
                style={{
                  animation: "fadeIn 0.2s ease-out forwards",
                }}
              >
                <button
                  onClick={() => {
                    onCategoriaClick("Mi Cuenta");
                    setShowDropdown(false);
                  }}
                  className="w-full flex items-center gap-3 px-5 py-2.5 text-left text-sm font-['Nunito'] text-[#F2EDE4]/80 hover:text-[#D4AF6A] hover:bg-[#D4AF6A]/10 transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px] font-light">account_circle</span>
                  Mi Perfil
                </button>
                <div className="border-t border-[#D4AF6A]/10 my-1" />
                <button
                  onClick={() => {
                    logout();
                    setShowDropdown(false);
                  }}
                  className="w-full flex items-center gap-3 px-5 py-2.5 text-left text-sm font-['Nunito'] text-[#9B2335] hover:bg-[#9B2335]/15 transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px] font-light">logout</span>
                  Cerrar Sesión
                </button>
              </div>
            )}
          </div>
        ) : (
          <button 
            onClick={() => onCategoriaClick("Pedidos")} // trigger login modal
            className="flex items-center gap-2 border border-[#D4AF6A]/30 hover:border-[#D4AF6A] hover:bg-[#D4AF6A]/10 text-[#F2EDE4]/80 hover:text-white px-5 py-2 rounded-lg font-['JetBrains_Mono'] text-[11px] uppercase tracking-widest transition-all duration-300 shadow-[0_4px_12px_rgba(0,0,0,0.15)] active:scale-[0.98]"
          >
            <span className="material-symbols-outlined text-[16px] font-light">login</span>
            Ingresar
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
