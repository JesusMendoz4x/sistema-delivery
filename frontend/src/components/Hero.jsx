import React, { useState, useEffect, useRef } from "react";
import logo from "../assets/logo.png";

function Hero({ onVerMenu, heroProgress = 0 }) {
  const [offsetY, setOffsetY] = useState(0);
  const latestY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    const onScroll = () => {
      latestY.current = window.scrollY;

      if (!ticking.current) {
        ticking.current = true;

        requestAnimationFrame(() => {
          setOffsetY(latestY.current);
          ticking.current = false;
        });
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* Fixed radial overlay behind content */}
      <div
        aria-hidden
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100vh",
          pointerEvents: "none",
          zIndex: 0,
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `radial-gradient(
              ellipse at 50% ${50 + heroProgress * 30}%,
              rgba(100,12,20,${Math.min(0.03 + heroProgress * 0.35, 0.5)}) 0%,
              transparent 65%
            )`,
            transition: "background 220ms ease-out",
            transform: `translateY(${offsetY}px)`,
            willChange: "transform",
          }}
        />

        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "radial-gradient(rgba(212, 175, 106, 0.03) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <section
        id="hero"
        className="relative w-full h-screen flex flex-col items-center justify-center overflow-visible"
      >
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
    </>
  );
}

export default Hero;
