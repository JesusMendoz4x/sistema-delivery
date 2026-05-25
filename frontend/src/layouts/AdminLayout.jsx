import { Outlet, NavLink } from "react-router-dom";

function AdminLayout() {
  const navLinks = [
    { to: "/admin", label: "Dashboard", icon: "dashboard" },
    { to: "/admin/productos", label: "Catálogo", icon: "restaurant_menu" },
    { to: "/admin/pedidos", label: "Órdenes", icon: "receipt_long" },
    { to: "/admin/usuarios", label: "Equipo", icon: "group" },
  ];

  return (
    <div 
      className="min-h-screen flex transition-colors duration-300 font-['Nunito']"
      style={{
        backgroundColor: "rgb(10,10,10)",
        position: "relative",
        overflowX: "hidden",
      }}
    >
      {/* Ellipse de fondo idéntico al del cliente */}
      <div
        aria-hidden
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100vh",
          zIndex: 0,
          pointerEvents: "none",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "62%",
            width: "66vw",
            maxWidth: "980px",
            aspectRatio: "1 / 1",
            transform: "translate3d(-50%, -50%, 0)",
            borderRadius: "50%",
            background:
              "radial-gradient(circle at 50% 50%, rgba(140, 0, 0, 0.42) 0%, rgba(95, 0, 0, 0.2) 32%, rgba(30, 0, 0, 0.1) 55%, rgba(10, 10, 10, 0) 72%)",
            filter: "blur(54px)",
            opacity: 0.95,
          }}
        />
      </div>

      {/* Sidebar */}
      <aside className="w-64 bg-transparent border-r border-[#D4AF6A]/10 flex flex-col z-20 relative">
        <div className="p-8 flex justify-center border-b border-[#D4AF6A]/10">
          <h2 className="text-[14px] font-['Outfit'] text-[#D4AF6A] font-bold tracking-[0.3em] uppercase">
            Casablanca
          </h2>
        </div>
        
        <nav className="flex-1 space-y-1 mt-8">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/admin"}
              className={({ isActive }) =>
                `flex items-center gap-4 px-8 py-4 transition-all duration-300 ${
                  isActive
                    ? "border-l-2 border-[#D4AF6A] text-[#D4AF6A] bg-[#141414]/50"
                    : "border-l-2 border-transparent text-[#F2EDE4]/50 hover:text-[#D4AF6A] hover:bg-[#141414]/30"
                }`
              }
            >
              <span className="material-symbols-outlined text-[20px] font-light">{link.icon}</span>
              <span className="font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.2em]">{link.label}</span>
            </NavLink>
          ))}
        </nav>
        
        <div className="p-8 border-t border-[#D4AF6A]/10">
          <button className="flex items-center gap-4 text-[#F2EDE4]/50 hover:text-[#9B2335] transition-colors w-full group">
            <span className="material-symbols-outlined text-[20px] group-hover:text-[#9B2335] transition-colors font-light">logout</span>
            <span className="font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.2em] group-hover:text-[#9B2335] transition-colors">Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative z-10">
        {/* Topbar */}
        <header className="h-20 border-b border-[#D4AF6A]/10 flex items-center justify-between px-12 z-20 relative bg-[#0a0a0a]/30 backdrop-blur-sm">
          <h1 className="text-[14px] font-['Outfit'] text-[#F2EDE4] tracking-[0.2em] uppercase">
            Panel de Control
          </h1>
          <div className="flex items-center gap-5">
            <div className="text-right">
              <p className="font-['JetBrains_Mono'] text-[10px] tracking-[0.2em] uppercase text-[#D4AF6A]">Administrador</p>
              <p className="text-[11px] text-[#F2EDE4]/40 font-['Nunito'] mt-0.5">admin@casablanca.com</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-[#141414] border border-[#D4AF6A]/30 flex items-center justify-center text-[#D4AF6A] font-['Outfit'] shadow-[0_4px_10px_rgba(0,0,0,0.5)]">
              A
            </div>
          </div>
        </header>

        {/* Content area */}
        <div className="flex-1 overflow-auto p-12 relative z-10">
            <div className="max-w-7xl mx-auto">
              <Outlet />
            </div>
        </div>
      </main>
    </div>
  );
}

export default AdminLayout;
