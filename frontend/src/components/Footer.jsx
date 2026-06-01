import { useEffect, useRef, useState } from "react";

function useInView(threshold = 0.2) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, inView];
}

function Footer() {
  const [footerRef, inView] = useInView(0.3);

  return (
    <footer
      ref={footerRef}
      className="py-8 md:py-12 px-6 md:px-16 border-t border-[#D4AF6A]/10"
    >
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-6 md:gap-0 justify-between items-center text-center">
        {/* Logo — slide desde izquierda */}
        <div
          className="flex flex-col items-center md:items-start"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? "translateY(0)" : "translateY(20px)",
            transition:
              "opacity 0.6s ease-out 0.1s, transform 0.6s ease-out 0.1s",
          }}
        >
          <span className="font-['EB_Garamond'] text-[16px] tracking-widest uppercase text-[#D4AF6A]">
            Casablanca
          </span>
          <span className="font-['JetBrains_Mono'] text-[9px] text-[#F2EDE4]/30 tracking-widest mt-1">
            EST. 1981
          </span>
        </div>

        {/* Centro — fade in */}
        <div
          className="flex flex-col items-center gap-1"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? "translateY(0)" : "translateY(20px)",
            transition:
              "opacity 0.6s ease-out 0.3s, transform 0.6s ease-out 0.3s",
          }}
        >
          <span className="font-['JetBrains_Mono'] text-[9px] text-[#F2EDE4]/20 uppercase tracking-widest leading-relaxed">
            © 2025 Casablanca. Todos los derechos reservados.
          </span>
        </div>

        {/* Desarrollador — slide desde derecha */}
        <div
          className="flex flex-col items-center md:items-end"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? "translateY(0)" : "translateY(20px)",
            transition:
              "opacity 0.6s ease-out 0.5s, transform 0.6s ease-out 0.5s",
          }}
        >
          <span className="font-['JetBrains_Mono'] text-[9px] text-[#F2EDE4]/30 uppercase tracking-widest">
            Desarrollado por
          </span>
          <span className="font-['EB_Garamond'] text-[14px] text-[#D4AF6A]/70 mt-1">
            Equipo Casablanca Dev
          </span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
