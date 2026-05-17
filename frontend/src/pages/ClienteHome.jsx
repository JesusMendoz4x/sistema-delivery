import { useState, useEffect, useRef } from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Descripcion from "../components/Descripcion";
import Ubicacion from "../components/Ubicacion";
import Footer from "../components/Footer";
import MenuGrid from "../components/MenuGrid";
import CartPanel from "../components/CartPanel";

function ClienteHome() {
  const [categoriaActiva, setCategoriaActiva] = useState("Entradas");
  const [carrito, setCarrito] = useState([]);
  const [mostrarMenu, setMostrarMenu] = useState(false);
  const [mostrarCarrito, setMostrarCarrito] = useState(false);
  const [heroProgress, setHeroProgress] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const latestY = useRef(0);
  const ticking = useRef(false);
  const infoRef = useRef(null);
  const ubicacionRef = useRef(null);
  const footerRef = useRef(null);
  const [overlayHeight, setOverlayHeight] = useState(window.innerHeight);
  const [warmOpacity, setWarmOpacity] = useState(0);
  const [accentOpacity, setAccentOpacity] = useState(0);
  const [darkOpacity, setDarkOpacity] = useState(0);

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

  const totalItems = carrito.reduce((acc, item) => acc + item.cantidad, 0);

  useEffect(() => {
    const handleScroll = () => {
      if (mostrarMenu) return;

      const heroEl = document.getElementById("hero");
      const heroHeight = (heroEl && heroEl.offsetHeight) || window.innerHeight;
      const scrollY = window.scrollY;

      // Progress only across the hero height for smoother control
      let progress = Math.min(Math.max(scrollY / heroHeight, 0), 1);

      // Ease-out for smoother feel
      const eased = 1 - Math.cos((progress * Math.PI) / 2);
      setHeroProgress(eased);

      // compute overlay height so it doesn't extend past footer
      const footerEl = footerRef.current;
      if (footerEl) {
        const footerTop = footerEl.getBoundingClientRect().top + window.scrollY;
        setOverlayHeight(footerTop || window.innerHeight);
      }

      // compute progress inside Descripcion (info) and Ubicacion
      const vh = window.innerHeight;
      const computeSectionProgress = (el) => {
        if (!el) return 0;
        const rect = el.getBoundingClientRect();
        // progress 0 when top is below viewport bottom, 1 when fully passed top
        const center = vh / 2;
        const start = rect.top;
        const len = rect.height || vh;
        const p = Math.min(Math.max((center - start) / len, 0), 1);
        return p;
      };

      const pInfo = computeSectionProgress(infoRef.current);
      const pUbic = computeSectionProgress(ubicacionRef.current);

      // warm blob (strong red) tied to Descripcion but faded as Ubicacion grows
      const warmBase = Math.min(0.12 + pInfo * 0.88, 0.95);
      setWarmOpacity(warmBase * (1 - pUbic));
      // accent blob (faded red) also diminishes as Ubicacion comes in
      const accentBase = Math.min(0.04 + pInfo * 0.5, 0.85);
      setAccentOpacity(accentBase * (1 - pUbic));
      // dark overlay grows with Ubicacion progress to fade to black
      setDarkOpacity(Math.min(pUbic * 0.9, 0.9));
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // run once to set initial progress
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [mostrarMenu]);

  const agregarAlCarrito = (producto) => {
    setCarrito((prev) => {
      const existe = prev.find((item) => item.id === producto.id);
      if (existe) {
        return prev.map((item) =>
          item.id === producto.id
            ? { ...item, cantidad: item.cantidad + 1 }
            : item,
        );
      }
      return [...prev, { ...producto, cantidad: 1 }];
    });
  };

  const incrementar = (id) => {
    setCarrito((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, cantidad: item.cantidad + 1 } : item,
      ),
    );
  };

  const decrementar = (id) => {
    setCarrito((prev) => {
      const item = prev.find((i) => i.id === id);
      if (item.cantidad === 1) return prev.filter((i) => i.id !== id);
      return prev.map((i) =>
        i.id === id ? { ...i, cantidad: i.cantidad - 1 } : i,
      );
    });
  };

  const confirmarPedido = () => {
    alert("Pedido confirmado");
  };

  return (
    <div
      className="min-h-screen transition-colors duration-300"
      style={{ backgroundColor: "rgb(16,16,16)", position: "relative" }}
    >
      {/* Background blobs placed inside the page container so they sit behind content */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: overlayHeight,
          zIndex: 0,
          pointerEvents: "none",
          overflow: "hidden",
        }}
      >
        <svg
          viewBox="0 0 500 500"
          preserveAspectRatio="xMidYMid slice"
          style={{
            position: "absolute",
            left: "50%",
            top: "8%",
            width: "120%",
            height: "120%",
            transform: `translate(-50%, ${offsetY * 0.6}px) scale(${1 + heroProgress * 0.22})`,
            opacity: warmOpacity,
            filter: "blur(36px)",
            transition: "opacity 220ms ease-out, transform 220ms linear",
          }}
        >
          <defs>
            <linearGradient id="gWarmPage" x1="0%" x2="100%">
              <stop offset="0%" stopColor="#5a0f0f" />
              <stop offset="50%" stopColor="#8b1010" />
              <stop offset="100%" stopColor="#c0392b" />
            </linearGradient>
          </defs>
          <path
            d="M421.5,307.5Q371,365,307,387.5Q243,410,183,379Q123,348,86,288Q49,228,83,165Q117,102,180.5,72.5Q244,43,305,63Q366,83,410.5,129.5Q455,176,421.5,307.5Z"
            fill="url(#gWarmPage)"
          />
        </svg>
        <svg
          viewBox="0 0 500 500"
          preserveAspectRatio="xMidYMid slice"
          style={{
            position: "absolute",
            left: "35%",
            top: "35%",
            width: "90%",
            height: "90%",
            transform: `translate(-50%, ${offsetY * 0.9}px) scale(${1 + heroProgress * 0.14})`,
            opacity: accentOpacity,
            filter: "blur(56px)",
            mixBlendMode: "screen",
            transition: "opacity 220ms ease-out, transform 220ms linear",
          }}
        >
          <defs>
            <linearGradient id="gAccentPage" x1="0%" x2="100%">
              <stop offset="0%" stopColor="#ff6b6b" />
              <stop offset="100%" stopColor="#ff3b3b" />
            </linearGradient>
          </defs>
          <path
            d="M400,300Q360,380,300,410Q240,440,180,410Q120,380,80,320Q40,260,70,190Q100,120,170,90Q240,60,310,80Q380,100,420,150Q460,200,400,300Z"
            fill="url(#gAccentPage)"
          />
        </svg>
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "radial-gradient(rgba(212, 175, 106, 0.02) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
            mixBlendMode: "overlay",
            opacity: 0.6,
          }}
        />
        {/* dark overlay when entering Ubicacion */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: `rgba(0,0,0,${darkOpacity})`,
            transition: "background-color 220ms ease-out",
          }}
        />
      </div>

      <div style={{ position: "relative", zIndex: 10 }}>
        <Navbar
          categoriaActiva={categoriaActiva}
          onCategoriaClick={(cat) => {
            if (cat === "Inicio") {
              setMostrarMenu(false);
              setCategoriaActiva("Inicio");
              return;
            }
            setCategoriaActiva(cat);
            setMostrarMenu(true);
          }}
          totalItems={totalItems}
          onCarritoClick={() => setMostrarCarrito(!mostrarCarrito)}
        />

        {!mostrarMenu ? (
          <>
            <Hero
              heroProgress={heroProgress}
              onVerMenu={() => setMostrarMenu(true)}
            />
            <div ref={infoRef}>
              <Descripcion heroProgress={heroProgress} />
            </div>
            <div ref={ubicacionRef}>
              <Ubicacion heroProgress={heroProgress} />
            </div>
            <div ref={footerRef}>
              <Footer heroProgress={heroProgress} />
            </div>
          </>
        ) : (
          <div className="pt-20 flex">
            <MenuGrid
              categoriaActiva={categoriaActiva}
              onAgregar={agregarAlCarrito}
            />
            {mostrarCarrito && (
              <CartPanel
                items={carrito}
                onIncrementar={incrementar}
                onDecrementar={decrementar}
                onConfirmar={confirmarPedido}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ClienteHome;
