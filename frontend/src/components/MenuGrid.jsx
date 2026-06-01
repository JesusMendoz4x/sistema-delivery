import { useRef, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import MenuCard from "./MenuCard";
import { useAuth } from "../context/AuthContext";
import fondoMenu from "../assets/fondoMenu.png";
import { getProductos } from "../services/productosService";



const categorias = [
  "Entradas",
  "Sushi & Sashimi",
  "Dumplings",
  "Especialidades",
  "Postres",
];

function useInView(threshold = 0.15) {
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

// ─── Carrusel genérico (Entradas, Sushi, Dumplings) ──────────────────────────
function CarruselSeccion({ categoria, items, onAgregar, onOpen, variant }) {
  const carruselRef = useRef(null);
  const [seccionRef, inView] = useInView(0.1);
  const cardStep = 280;

  const handleScroll = (dir) => {
    if (!carruselRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = carruselRef.current;
    if (dir > 0 && scrollLeft + clientWidth + 2 >= scrollWidth) {
      carruselRef.current.scrollTo({ left: 0, behavior: "smooth" });
      return;
    }
    if (dir < 0 && scrollLeft <= 2) {
      carruselRef.current.scrollTo({ left: scrollWidth, behavior: "smooth" });
      return;
    }
    carruselRef.current.scrollBy({ left: dir * cardStep, behavior: "smooth" });
  };

  return (
    <div className="mb-16" ref={seccionRef}>
      <div className="flex items-center gap-6 mb-4">
        <div
          className="h-px flex-grow"
          style={{
            background: "rgba(212, 175, 106, 0.15)",
            transform: inView ? "scaleX(1)" : "scaleX(0)",
            transformOrigin: "right",
            transition: "transform 0.7s ease-out 0.1s",
          }}
        />
        <span
          className="font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.3em]"
          style={{
            color: "rgba(212, 175, 106, 0.5)",
            opacity: inView ? 1 : 0,
            transition: "opacity 0.5s ease-out 0.3s",
          }}
        >
          {items.length} platillos
        </span>
        <div
          className="h-px flex-grow"
          style={{
            background: "rgba(212, 175, 106, 0.15)",
            transform: inView ? "scaleX(1)" : "scaleX(0)",
            transformOrigin: "left",
            transition: "transform 0.7s ease-out 0.1s",
          }}
        />
      </div>

      <h2
        className="font-['EB_Garamond'] text-[32px] mb-6"
        style={{
          color: "#F2EDE4",
          opacity: inView ? 1 : 0,
          transform: inView ? "translateX(0)" : "translateX(-40px)",
          transition:
            "opacity 0.6s ease-out 0.2s, transform 0.6s ease-out 0.2s",
        }}
      >
        {categoria}
      </h2>

      <div
        className="relative overflow-visible"
        style={{ maxWidth: "1120px", margin: "0 auto" }}
      >
        <button
          type="button"
          aria-label="Anterior"
          onClick={() => handleScroll(-1)}
          className="hidden md:flex absolute left-0 top-1/2 -translate-x-[120%] -translate-y-1/2 z-20 h-10 w-10 rounded-full border border-[#D4AF6A]/40 bg-[#141414]/90 text-[#D4AF6A] shadow-[0_8px_20px_rgba(0,0,0,0.35)] transition-colors items-center justify-center hover:border-[#D4AF6A] hover:bg-[#1a1a1a]"
        >
          &#8592;
        </button>
        <button
          type="button"
          aria-label="Siguiente"
          onClick={() => handleScroll(1)}
          className="hidden md:flex absolute right-0 top-1/2 translate-x-[70%] -translate-y-1/2 z-20 h-10 w-10 rounded-full border border-[#D4AF6A]/40 bg-[#141414]/90 text-[#D4AF6A] shadow-[0_8px_20px_rgba(0,0,0,0.35)] transition-colors items-center justify-center hover:border-[#D4AF6A] hover:bg-[#1a1a1a]"
        >
          &#8594;
        </button>

        <div
          ref={carruselRef}
          className="carrusel flex flex-nowrap gap-5 overflow-x-auto overflow-y-visible py-3"
          style={{
            WebkitOverflowScrolling: "touch",
            scrollSnapType: "x mandatory",
          }}
        >
          {items.map((producto, i) => (
            <div
              key={producto.id}
              className="flex-shrink-0"
              style={{
                width: "260px",
                scrollSnapAlign: "start",
                opacity: inView ? 1 : 0,
                transform: inView ? "translateX(0)" : "translateX(60px)",
                transition: `opacity 0.5s ease-out ${0.3 + i * 0.07}s, transform 0.5s ease-out ${0.3 + i * 0.07}s`,
              }}
            >
              <MenuCard
                {...producto}
                onAgregar={() => onAgregar(producto)}
                onOpen={() => onOpen(producto)}
                variant={variant}
              />
            </div>
          ))}
          <div className="flex-shrink-0" style={{ width: "1px" }} />
        </div>
      </div>

      <div className="flex items-center gap-2 mt-3">
        <div
          className="h-px flex-grow"
          style={{ background: "rgba(212, 175, 106, 0.08)" }}
        />
        <span
          className="font-['JetBrains_Mono'] text-[9px] uppercase tracking-widest"
          style={{ color: "rgba(212, 175, 106, 0.3)" }}
        >
          desliza →
        </span>
      </div>
    </div>
  );
}

// ─── Especialidades: carrusel con wrapper editorial dorado ────────────────────
function EspecialidadesSeccion({ items, onAgregar, onOpen }) {
  const carruselRef = useRef(null);
  const [seccionRef, inView] = useInView(0.1);
  const cardStep = 280;

  const handleScroll = (dir) => {
    if (!carruselRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = carruselRef.current;
    if (dir > 0 && scrollLeft + clientWidth + 2 >= scrollWidth) {
      carruselRef.current.scrollTo({ left: 0, behavior: "smooth" });
      return;
    }
    if (dir < 0 && scrollLeft <= 2) {
      carruselRef.current.scrollTo({ left: scrollWidth, behavior: "smooth" });
      return;
    }
    carruselRef.current.scrollBy({ left: dir * cardStep, behavior: "smooth" });
  };

  return (
    <div
      ref={seccionRef}
      className="mb-16"
      style={{
        background: "rgba(212,175,106,0.07)",
        borderTop: "2px solid rgba(212,175,106,0.6)",
        borderBottom: "1px solid rgba(212,175,106,0.25)",
        margin: "0 calc(-1 * clamp(16px, 4vw, 40px)) 64px",
        padding: "28px clamp(16px,4vw,40px) 32px",
        position: "relative",
      }}
    >
      {/* Ornamento esquina superior izquierda */}
      <div
        style={{
          position: "absolute",
          top: "10px",
          left: "clamp(16px,4vw,40px)",
          width: "24px",
          height: "24px",
          borderTop: "1px solid rgba(212,175,106,0.6)",
          borderLeft: "1px solid rgba(212,175,106,0.6)",
          opacity: inView ? 1 : 0,
          transition: "opacity 0.4s ease-out 0.05s",
        }}
      />
      {/* Ornamento esquina superior derecha */}
      <div
        style={{
          position: "absolute",
          top: "10px",
          right: "clamp(16px,4vw,40px)",
          width: "24px",
          height: "24px",
          borderTop: "1px solid rgba(212,175,106,0.6)",
          borderRight: "1px solid rgba(212,175,106,0.6)",
          opacity: inView ? 1 : 0,
          transition: "opacity 0.4s ease-out 0.05s",
        }}
      />

      {/* Eyebrow */}
      <p
        className="font-['JetBrains_Mono'] text-[8px] uppercase tracking-[0.35em] mb-1"
        style={{
          color: "#D4AF6A",
          opacity: inView ? 1 : 0,
          transition: "opacity 0.5s ease-out 0.1s",
        }}
      >
        — Cocina de autor
      </p>

      {/* Título con acento dorado */}
      <h2
        className="font-['EB_Garamond'] text-[36px] mb-1"
        style={{
          color: "#D4AF6A",
          fontWeight: 400,
          letterSpacing: "0.02em",
          opacity: inView ? 1 : 0,
          transform: inView ? "translateX(0)" : "translateX(-40px)",
          transition:
            "opacity 0.6s ease-out 0.15s, transform 0.6s ease-out 0.15s",
        }}
      >
        Especialidades
      </h2>

      {/* Divisor dorado con conteo */}
      <div className="flex items-center gap-6 mb-6">
        <div
          style={{
            height: "1px",
            flexGrow: 1,
            background: "rgba(212, 175, 106, 0.4)",
            transform: inView ? "scaleX(1)" : "scaleX(0)",
            transformOrigin: "left",
            transition: "transform 0.7s ease-out 0.25s",
          }}
        />
        <span
          className="font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.3em]"
          style={{
            color: "rgba(212, 175, 106, 0.8)",
            opacity: inView ? 1 : 0,
            transition: "opacity 0.5s ease-out 0.4s",
          }}
        >
          ✦ {items.length} platillos ✦
        </span>
        <div
          style={{
            height: "1px",
            flexGrow: 1,
            background: "rgba(212, 175, 106, 0.4)",
            transform: inView ? "scaleX(1)" : "scaleX(0)",
            transformOrigin: "right",
            transition: "transform 0.7s ease-out 0.25s",
          }}
        />
      </div>

      {/* Carrusel */}
      <div
        className="relative overflow-visible"
        style={{ maxWidth: "1120px", margin: "0 auto" }}
      >
        <button
          type="button"
          aria-label="Anterior"
          onClick={() => handleScroll(-1)}
          className="hidden md:flex absolute left-0 top-1/2 -translate-x-[120%] -translate-y-1/2 z-20 h-10 w-10 rounded-full bg-[#1a1500]/90 text-[#D4AF6A] shadow-[0_8px_20px_rgba(0,0,0,0.35)] transition-colors items-center justify-center hover:bg-[#251e00]"
          style={{ border: "1px solid rgba(212,175,106,0.6)" }}
        >
          &#8592;
        </button>
        <button
          type="button"
          aria-label="Siguiente"
          onClick={() => handleScroll(1)}
          className="hidden md:flex absolute right-0 top-1/2 translate-x-[70%] -translate-y-1/2 z-20 h-10 w-10 rounded-full bg-[#1a1500]/90 text-[#D4AF6A] shadow-[0_8px_20px_rgba(0,0,0,0.35)] transition-colors items-center justify-center hover:bg-[#251e00]"
          style={{ border: "1px solid rgba(212,175,106,0.6)" }}
        >
          &#8594;
        </button>

        <div
          ref={carruselRef}
          className="carrusel flex flex-nowrap gap-5 overflow-x-auto overflow-y-visible py-3"
          style={{
            WebkitOverflowScrolling: "touch",
            scrollSnapType: "x mandatory",
          }}
        >
          {items.map((producto, i) => (
            <div
              key={producto.id}
              className="flex-shrink-0"
              style={{
                width: "260px",
                scrollSnapAlign: "start",
                opacity: inView ? 1 : 0,
                transform: inView ? "translateX(0)" : "translateX(60px)",
                transition: `opacity 0.5s ease-out ${0.3 + i * 0.07}s, transform 0.5s ease-out ${0.3 + i * 0.07}s`,
              }}
            >
              {/* Tarjeta con fondo dorado tenue y borde marcado */}
              <div
                style={{
                  background: "rgba(212,175,106,0.06)",
                  border: "1px solid rgba(212,175,106,0.4)",
                  borderRadius: "3px",
                  overflow: "hidden",
                  height: "100%",
                }}
              >
                {/* Línea dorada top más gruesa */}
                <div
                  style={{
                    height: "3px",
                    background: "#D4AF6A",
                    opacity: 0.85,
                  }}
                />
                <div style={{ padding: "0" }}>
                  <MenuCard
                    {...producto}
                    onAgregar={() => onAgregar(producto)}
                    onOpen={() => onOpen(producto)}
                  />
                </div>
              </div>
            </div>
          ))}
          <div className="flex-shrink-0" style={{ width: "1px" }} />
        </div>
      </div>

      <div className="flex items-center gap-2 mt-4">
        <div
          style={{
            height: "1px",
            flexGrow: 1,
            background: "rgba(212, 175, 106, 0.2)",
          }}
        />
        <span
          className="font-['JetBrains_Mono'] text-[9px] uppercase tracking-widest"
          style={{ color: "rgba(212, 175, 106, 0.5)" }}
        >
          desliza →
        </span>
      </div>
    </div>
  );
}

function ProductModal({ item, onClose, onAgregar, variant = "gold" }) {
  const { isLoggedIn, openAuthWall } = useAuth();

  if (!item) return null;
  if (typeof document === "undefined") return null;

  const paletteByVariant = {
    gold: {
      accent: "#D4AF6A",
      accentSoft: "rgba(212, 175, 106, 0.25)",
      eyebrow: "rgba(212, 175, 106, 0.6)",
      background:
        "linear-gradient(155deg, rgba(70, 52, 24, 0.98) 0%, rgba(32, 24, 18, 0.98) 45%, rgba(12, 12, 12, 0.98) 100%)",
      badgeText: "#1a1a1a",
    },
    red: {
      accent: "#C24B45",
      accentSoft: "rgba(194, 75, 69, 0.3)",
      eyebrow: "rgba(194, 75, 69, 0.7)",
      background:
        "linear-gradient(155deg, rgba(46, 16, 18, 0.98) 0%, rgba(26, 10, 12, 0.98) 50%, rgba(14, 8, 10, 0.98) 100%)",
      badgeText: "#1a1a1a",
    },
    rose: {
      accent: "#E77B9B",
      accentSoft: "rgba(231, 123, 155, 0.32)",
      eyebrow: "rgba(231, 123, 155, 0.7)",
      background:
        "linear-gradient(155deg, rgba(58, 16, 28, 0.98) 0%, rgba(32, 10, 20, 0.98) 50%, rgba(16, 8, 12, 0.98) 100%)",
      badgeText: "#1a1a1a",
    },
  };

  const palette = paletteByVariant[variant] ?? paletteByVariant.gold;

  const handleAgregar = () => {
    if (!isLoggedIn) {
      openAuthWall("agregar");
      return;
    }
    onAgregar(item);
    onClose();
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center px-4"
      style={{
        background: "rgba(0, 0, 0, 0.7)",
        animation: "fadeIn 0.2s ease-out",
      }}
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[560px] rounded-[18px] p-6"
        style={{
          background: palette.background,
          border: `1px solid ${palette.accentSoft}`,
          boxShadow: "0 20px 60px rgba(0,0,0,0.55)",
          animation: "cardLift 0.35s ease-out",
          transformOrigin: "center",
        }}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 mb-5">
          <div>
            <p
              className="font-['JetBrains_Mono'] text-[9px] uppercase tracking-[0.3em] mb-2"
              style={{ color: palette.eyebrow }}
            >
              {item.categoria}
            </p>
            <h3
              className="font-['EB_Garamond'] text-[28px] leading-tight"
              style={{ color: "#F2EDE4", fontWeight: 400 }}
            >
              {item.nombre}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="h-9 w-9 rounded-full border text-xs"
            style={{
              borderColor: palette.accentSoft,
              color: "#F2EDE4",
              background: "rgba(0,0,0,0.4)",
            }}
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>

        <div className="flex flex-col gap-5 md:flex-row">
          <div
            className="w-full md:w-[220px] h-48 md:h-[220px] shrink-0 overflow-hidden rounded-[14px]"
            style={{ border: `1px solid ${palette.accentSoft}` }}
          >
            {item.imagen ? (
              <img
                src={item.imagen}
                alt={item.nombre}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex min-h-[220px] items-center justify-center bg-[#111111] text-[#D4AF6A]">
                <span className="material-symbols-outlined text-[54px]">restaurant</span>
              </div>
            )}
          </div>

          <div className="flex flex-col flex-1">
            {item.badge && (
              <span
                className="font-['JetBrains_Mono'] text-[9px] uppercase tracking-[0.25em] mb-3 inline-block"
                style={{
                  color: palette.badgeText,
                  background: palette.accent,
                  padding: "4px 10px",
                  alignSelf: "flex-start",
                }}
              >
                {item.badge}
              </span>
            )}

            <p
              className="font-['DM_Sans'] text-[14px] leading-relaxed"
              style={{ color: "rgba(242, 237, 228, 0.75)" }}
            >
              {item.descripcion}
            </p>

            <div
              className="mt-6 flex items-center justify-between"
              style={{
                borderTop: `1px solid ${palette.accentSoft}`,
                paddingTop: "16px",
              }}
            >
              <span
                className="font-['JetBrains_Mono'] text-[16px]"
                style={{ color: palette.accent }}
              >
                ${item.precio}
              </span>
              <button
                type="button"
                className="font-['JetBrains_Mono'] text-[10px] uppercase tracking-widest px-4 py-2 transition-colors duration-200 active:scale-95"
                style={{
                  background: "#9B2335",
                  color: "#F2EDE4",
                  border: "none",
                }}
                onClick={handleAgregar}
              >
                Agregar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}

// ─── MenuGrid principal ───────────────────────────────────────────────────────
function MenuGrid({ categoriaActiva, onAgregar }) {
  const [productos, setProductos] = useState([]);
  const [detalleActivo, setDetalleActivo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const getVariantByCategory = (categoria) => {
    if (categoria === "Especialidades") return "gold";
    if (categoria === "Postres") return "rose";
    return "red";
  };

  // Carga del catálogo real desde MongoDB en Docker
  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const data = await getProductos();
        setProductos(data);
      } catch (error) {
        console.error("Error al cargar productos en el menú:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProductos();
  }, []);

  useEffect(() => {
    if (!detalleActivo) return undefined;
    const handleKey = (event) => {
      if (event.key === "Escape") setDetalleActivo(null);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [detalleActivo]);

  // Pantalla de carga premium en segundo plano mientras responde Axios
  if (isLoading) {
    return (
      <main
        className="flex-grow min-h-screen flex items-center justify-center"
        style={{ background: "rgb(16,16,16)" }}
      >
        <p className="font-['JetBrains_Mono'] text-[#D4AF6A] text-sm tracking-widest uppercase animate-pulse">
          Cargando exquisito catálogo de Casablanca...
        </p>
      </main>
    );
  }

  return (
    <>
      <main
        className="flex-grow min-h-screen px-[clamp(16px,4vw,40px)] py-[40px]"
        style={{
          background: "rgb(16,16,16)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url(${fondoMenu})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.22,
            filter: "grayscale(0.15) contrast(1.05)",
          }}
        />
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(10,10,10,0.9) 0%, rgba(10,10,10,0.7) 40%, rgba(10,10,10,0.95) 100%)",
          }}
        />

        <div style={{ position: "relative", zIndex: 1 }}>
          <header className="mb-12">
            <div className="flex justify-between items-end mb-4">
              <h1
                className="font-['EB_Garamond'] text-[40px] uppercase leading-tight"
                style={{
                  color: "#9B2335",
                  fontWeight: 600,
                  opacity: 0,
                  animation: "slideFromLeft 0.6s ease-out 0.1s forwards",
                }}
              >
                {categoriaActiva}
              </h1>
              <span
                className="font-['JetBrains_Mono'] text-[12px] tracking-widest"
                style={{
                  color: "rgba(212, 175, 106, 0.5)",
                  opacity: 0,
                  animation: "fadeIn 0.6s ease-out 0.3s forwards",
                }}
              >
                FILTRAR POR PREFERENCIA
              </span>
            </div>
            <div
              className="h-px w-full"
              style={{
                background: "rgba(212, 175, 106, 0.15)",
                transform: "scaleX(0)",
                transformOrigin: "left",
                animation: "expandLine 0.7s ease-out 0.2s forwards",
              }}
            />
          </header>

          {categorias.map((cat) => {
            const items = productos.filter((p) => p.categoria === cat);
            if (items.length === 0) return null;

            if (cat === "Especialidades") {
              return (
                <EspecialidadesSeccion
                  key={cat}
                  items={items}
                  onAgregar={onAgregar}
                  onOpen={setDetalleActivo}
                />
              );
            }

            const variant = getVariantByCategory(cat);

            return (
              <CarruselSeccion
                key={cat}
                categoria={cat}
                items={items}
                onAgregar={onAgregar}
                onOpen={setDetalleActivo}
                variant={variant}
              />
            );
          })}
        </div>
      </main>

      <ProductModal
        item={detalleActivo}
        onClose={() => setDetalleActivo(null)}
        onAgregar={onAgregar}
        variant={
          detalleActivo ? getVariantByCategory(detalleActivo.categoria) : "gold"
        }
      />
    </>
  );
}

export default MenuGrid;
