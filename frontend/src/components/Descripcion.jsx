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

function useCountUp(target, inView, duration = 1500) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const numeric = parseInt(target.replace("+", ""));
    const steps = 40;
    const stepTime = duration / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += Math.ceil(numeric / steps);
      if (current >= numeric) {
        setCount(numeric);
        clearInterval(timer);
      } else {
        setCount(current);
      }
    }, stepTime);
    return () => clearInterval(timer);
  }, [inView, target, duration]);

  return count;
}

function StatItem({ numero, label, inView, delay }) {
  const count = useCountUp(numero, inView);
  const hasPlus = numero.includes("+");

  return (
    <div
      className="grid grid-cols-[24px_1fr] items-center gap-6"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(20px)",
        transition: `opacity 0.6s ease-out ${delay}s, transform 0.6s ease-out ${delay}s`,
      }}
    >
      <div className="flex items-center justify-center">
        <span className="w-3 h-3 rounded-full bg-[#D4AF6A]" />
      </div>
      <div>
        <span className="font-['EB_Garamond'] text-[56px] text-[#D4AF6A] leading-none">
          {count}
          {hasPlus ? "+" : ""}
        </span>
        <p className="font-['JetBrains_Mono'] text-[11px] text-[#F2EDE4]/40 uppercase tracking-widest mt-1">
          {label}
        </p>
      </div>
    </div>
  );
}

function Descripcion() {
  const [sectionRef, inView] = useInView(0.2);

  return (
    <section id="info" className="py-32 px-16" ref={sectionRef}>
      {/* Separador — líneas crecen desde el centro */}
      <div className="flex items-center gap-6 mb-16">
        <div
          className="h-px flex-grow origin-right"
          style={{
            background: "rgba(212, 175, 106, 0.15)",
            transform: inView ? "scaleX(1)" : "scaleX(0)",
            transition: "transform 0.8s ease-out 0.1s",
            transformOrigin: "right",
          }}
        />
        <span
          className="font-['JetBrains_Mono'] text-[11px] uppercase tracking-[0.4em]"
          style={{
            color: "#D4AF6A",
            border: "1px solid rgba(212, 175, 106, 0.4)",
            padding: "6px 20px",
            textShadow:
              "0 0 12px rgba(212,175,106,0.6), 0 0 24px rgba(212,175,106,0.3)",
            opacity: inView ? 1 : 0,
            transition: "opacity 0.6s ease-out 0.4s",
          }}
        >
          Nuestra Historia
        </span>
        <div
          className="h-px flex-grow"
          style={{
            background: "rgba(212, 175, 106, 0.15)",
            transform: inView ? "scaleX(1)" : "scaleX(0)",
            transition: "transform 0.8s ease-out 0.1s",
            transformOrigin: "left",
          }}
        />
      </div>

      {/* Contenido */}
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-2 gap-24 items-center">
          {/* Columna izquierda */}
          <div>
            {/* Título slide desde izquierda */}
            <h2
              className="font-['EB_Garamond'] text-[52px] leading-tight text-[#F2EDE4] mb-8"
              style={{
                fontWeight: 400,
                opacity: inView ? 1 : 0,
                transform: inView ? "translateX(0)" : "translateX(-40px)",
                transition:
                  "opacity 0.7s ease-out 0.3s, transform 0.7s ease-out 0.3s",
              }}
            >
              Donde Japón
              <br />
              <span className="italic text-[#D4AF6A]">se encuentra</span>
              <br />
              con Oaxaca
            </h2>

            {/* Párrafo 1 */}
            <p
              className="font-['DM_Sans'] text-[15px] text-[#F2EDE4]/50 leading-relaxed mb-6"
              style={{
                opacity: inView ? 1 : 0,
                transition: "opacity 0.7s ease-out 0.6s",
              }}
            >
              Desde 1981, Casablanca ha fusionado la precisión y delicadeza de
              la cocina japonesa con los sabores profundos y auténticos de
              Oaxaca. Cada platillo es una conversación entre dos culturas,
              elaborado con ingredientes de temporada y técnicas heredadas de
              generaciones.
            </p>

            {/* Párrafo 2 */}
            <p
              className="font-['DM_Sans'] text-[15px] text-[#F2EDE4]/50 leading-relaxed"
              style={{
                opacity: inView ? 1 : 0,
                transition: "opacity 0.7s ease-out 0.85s",
              }}
            >
              Nuestro equipo de chefs viaja anualmente a Japón para traer de
              vuelta técnicas, ingredientes y una filosofía que se refleja en
              cada corte, cada caldo y cada presentación que llega a tu mesa.
            </p>
          </div>

          {/* Columna derecha — números con conteo */}
          <div className="relative">
            <div className="absolute left-3 top-0 bottom-0 w-px bg-[#D4AF6A]/10" />
            <div className="flex flex-col gap-8">
              {[
                { numero: "40+", label: "Años de experiencia", delay: 0.5 },
                { numero: "12", label: "Chefs especializados", delay: 0.7 },
                { numero: "60+", label: "Platillos en carta", delay: 0.9 },
              ].map((item) => (
                <StatItem
                  key={item.label}
                  numero={item.numero}
                  label={item.label}
                  inView={inView}
                  delay={item.delay}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Descripcion;
