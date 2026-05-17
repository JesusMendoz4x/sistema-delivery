import logo from "../assets/logo.png";

function Hero({ onVerMenu }) {
  return (
    <section className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Fondo oscuro con gradiente */}
      <div
        className="absolute inset-0 z-0"
        style={{ backgroundColor: "rgb(16, 16, 16)" }}
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(122, 5, 32, 0.15) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(rgba(212, 175, 106, 0.03) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* Línea decorativa top */}
      <div className="absolute top-32 left-1/2 -translate-x-1/2 w-px h-16 bg-gradient-to-b from-transparent to-[#D4AF6A]/30 z-10" />

      {/* Contenido */}
      <div className="relative z-10 flex flex-col items-center text-center px-8">
        <img
          src={logo}
          alt="Casablanca"
          className="w-24 h-24 object-contain mb-8 opacity-90"
        />

        <p className="font-['JetBrains_Mono'] text-[11px] tracking-[0.4em] text-[#D4AF6A]/70 uppercase mb-4">
          EST. 1981 · OAXACA, MÉXICO
        </p>

        <h1
          className="font-['EB_Garamond'] text-[72px] leading-none tracking-tight text-[#F2EDE4] mb-4"
          style={{ fontWeight: 600 }}
        >
          Casablanca
        </h1>

        <p className="font-['EB_Garamond'] text-[22px] text-[#F2EDE4]/50 italic mb-12 tracking-wide">
          Una experiencia gastronómica sin igual
        </p>

        <div className="flex items-center gap-6">
          <button
            onClick={onVerMenu}
            className="px-10 py-4 bg-primary font-['JetBrains_Mono'] text-[11px] uppercase tracking-[0.3em] text-white hover:bg-primary-container transition-all active:scale-[0.98]"
          >
            Ver Menú
          </button>
          <span className="font-['JetBrains_Mono'] text-[11px] text-[#F2EDE4]/40 uppercase tracking-widest">
            Mesa 12
          </span>
        </div>
      </div>

      {/* Línea decorativa bottom */}
      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10">
        <span className="font-['JetBrains_Mono'] text-[9px] text-[#F2EDE4]/30 uppercase tracking-widest">
          Scroll
        </span>
        <div className="w-px h-10 bg-gradient-to-b from-[#D4AF6A]/30 to-transparent" />
      </div>
    </section>
  );
}

export default Hero;
