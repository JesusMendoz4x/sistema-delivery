import logo from "../assets/logo.png";
import comida from "../assets/comida.png";

const titulo = "Casablanca";

function Hero({ onVerMenu, heroProgress = 0 }) {
  const subtleScale = 1 + Math.min(heroProgress * 0.02, 0.04);

  return (
    <section
      id="hero"
      className="relative w-full h-screen flex flex-col items-center justify-center overflow-visible"
    >
      {/* Fade desde negro al cargar */}
      <div
        className="absolute inset-0 z-20 bg-black pointer-events-none"
        style={{
          animation: "fadeFromBlack 1.2s ease-out forwards",
        }}
        aria-hidden="true"
      />

      {/* Fondo */}
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

      {/* Overlay scroll */}
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

      {/* Línea decorativa top */}
      <div className="absolute top-32 left-1/2 -translate-x-1/2 w-px h-16 bg-gradient-to-b from-transparent to-[#D4AF6A]/30 z-10" />

      {/* Contenido */}
      <div
        className="relative z-10 flex flex-col items-center text-center px-8"
        style={{ transform: `scale(${subtleScale})` }}
      >
        {/* Logo */}
        <img
          src={logo}
          alt="Casablanca"
          className="w-24 h-24 object-contain mb-8"
          style={{
            mixBlendMode: "multiply",
            opacity: 0,
            animation: "fadeIn 0.8s ease-out 0.3s forwards",
          }}
        />

        {/* EST. 1981 */}
        <p
          className="font-['JetBrains_Mono'] text-[11px] tracking-[0.4em] text-[#D4AF6A]/70 uppercase mb-4"
          style={{
            opacity: 0,
            animation: "fadeIn 0.6s ease-out 0.8s forwards",
          }}
        >
          EST. 1981 · OAXACA, MÉXICO
        </p>

        {/* Título letra por letra */}
        <h1
          className="font-['EB_Garamond'] text-[72px] leading-none tracking-tight text-[#F2EDE4] mb-4 flex"
          style={{ fontWeight: 600 }}
        >
          {titulo.split("").map((letra, i) => (
            <span
              key={i}
              style={{
                opacity: 0,
                display: "inline-block",
                animation: `slideUp 0.4s ease-out ${1 + i * 0.06}s forwards`,
              }}
            >
              {letra}
            </span>
          ))}
        </h1>

        {/* Subtítulo */}
        <p
          className="font-['EB_Garamond'] text-[22px] text-[#F2EDE4]/50 italic mb-12 tracking-wide"
          style={{
            opacity: 0,
            animation: "fadeIn 0.6s ease-out 1.8s forwards",
          }}
        >
          Una experiencia gastronómica sin igual
        </p>

        {/* Botones con delay entre ellos */}
        <div className="flex items-center gap-6">
          <button
            onClick={onVerMenu}
            className="px-10 py-4 bg-primary font-['JetBrains_Mono'] text-[11px] uppercase tracking-[0.3em] text-white hover:bg-primary-container transition-all active:scale-[0.98]"
            style={{
              opacity: 0,
              animation: "slideUp 0.5s ease-out 2s forwards",
            }}
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
            style={{
              opacity: 0,
              animation: "slideUp 0.5s ease-out 2.2s forwards",
            }}
          >
            Más Información
          </button>
        </div>
      </div>
    </section>
  );
}

export default Hero;
