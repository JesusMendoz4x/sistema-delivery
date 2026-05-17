import React from "react";
import logo from "../assets/logo.png";
import comida from "../assets/comida.png";

function Hero({ onVerMenu, heroProgress = 0 }) {
  const subtleScale = 1 + Math.min(heroProgress * 0.02, 0.04);

  return (
    <section
      id="hero"
      className="relative w-full h-screen flex flex-col items-center justify-center overflow-visible"
    >
      {/* Fondo con imagen y degradados (no afecta al contenido) */}
      <div
        id="hero-bg"
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(16,16,16,0.45) 0%, rgba(16,16,16,0.06) 45%, rgba(16,16,16,0.75) 100%), url(${comida})`,
          backgroundBlendMode: "overlay",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center center",
          filter: "brightness(0.88) contrast(1.08) saturate(0.9) blur(4px)",
        }}
        aria-hidden="true"
      />

      {/* Overlay para oscurecer progresivamente con el scroll */}
      <div
        id="hero-dark-overlay"
        className="absolute inset-0 z-5"
        style={{
          background: "rgba(0,0,0,1)",
          opacity: 0,
          pointerEvents: "none",
          transition: "opacity 220ms linear",
        }}
        aria-hidden="true"
      />

      {/* Degradado inferior eliminado para evitar cortar el fondo artístico */}
      {/* Línea decorativa top */}
      <div className="absolute top-32 left-1/2 -translate-x-1/2 w-px h-16 bg-gradient-to-b from-transparent to-[#D4AF6A]/30 z-10" />

      {/* Contenido */}
      <div
        className="relative z-10 flex flex-col items-center text-center px-8"
        style={{ transform: `scale(${subtleScale})` }}
      >
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

          <button
            onClick={() =>
              document
                .getElementById("info")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="px-10 py-4 border border-[#D4AF6A]/30 font-['JetBrains_Mono'] text-[11px] uppercase tracking-[0.3em] text-[#D4AF6A]/70 hover:border-[#D4AF6A] hover:text-[#D4AF6A] transition-all"
          >
            Más Información
          </button>
        </div>
      </div>
    </section>
  );
}

export default Hero;
