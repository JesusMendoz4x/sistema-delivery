import { useState, useEffect, useRef, useCallback } from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Descripcion from "../components/Descripcion";
import Ubicacion from "../components/Ubicacion";
import Footer from "../components/Footer";
import MenuGrid from "../components/MenuGrid";
import CartPanel from "../components/CartPanel";
import Sucursales from "../components/Sucursales";
import { AuthProvider, useAuth } from "../context/AuthContext";
import LoginModal from "../components/LoginModal";
import AuthWall from "../components/AuthWall";
import "../transitions.css";
// Duración de la animación de salida en ms — debe coincidir con transitions.css
const SALIDA_MS = 220;

function ClienteHomeInner() {
  const { isLoggedIn, login, logout, openAuthWall } = useAuth();

  const [categoriaActiva, setCategoriaActiva] = useState("Inicio");
  const [mostrarMenu, setMostrarMenu] = useState(false);
  const [carrito, setCarrito] = useState([]);
  const [mostrarCarrito, setMostrarCarrito] = useState(false);

  // "saliendo" dispara la animación de salida antes de cambiar la vista
  const [saliendo, setSaliendo] = useState(false);
  // Cola: guardamos el destino mientras se anima la salida
  const pendienteRef = useRef(null);

  const blobRef = useRef(null);
  const rafRef = useRef(null);
  const scrollY = useRef(0);

  useEffect(() => {
    if (mostrarMenu) return;

    const handleScroll = () => {
      scrollY.current = window.scrollY;
      if (!rafRef.current) {
        rafRef.current = requestAnimationFrame(() => {
          const y = scrollY.current;
          const maxScroll = document.body.scrollHeight - window.innerHeight;
          const progress = Math.min(y / maxScroll, 1);

          if (blobRef.current) {
            const opacity = 0.95 - Math.sin(progress * Math.PI) * 0.6;
            const rx1 = 50 + progress * 20;
            const ry1 = 50 - progress * 25;
            const rx2 = 50 - progress * 20;
            const ry2 = 50 + progress * 25;
            const borderRadius = `${rx1}% ${rx2}% ${rx2}% ${rx1}% / ${ry1}% ${ry1}% ${ry2}% ${ry2}%`;
            blobRef.current.style.opacity = opacity;
            blobRef.current.style.borderRadius = borderRadius;
          }

          rafRef.current = null;
        });
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [mostrarMenu]);

  // Aplica el cambio de vista pendiente una vez termina la animación de salida
  useEffect(() => {
    if (!saliendo) return;

    const timer = setTimeout(() => {
      const { cat, menu } = pendienteRef.current;
      setCategoriaActiva(cat);
      setMostrarMenu(menu);
      setSaliendo(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, SALIDA_MS);

    return () => clearTimeout(timer);
  }, [saliendo]);

  // Navegación con transición
  const handleCategoriaClick = useCallback(
    (cat) => {
      if (cat === "Pedidos" && !isLoggedIn) {
        openAuthWall("pedidos");
        return;
      }

      // Si ya estamos en esa categoría, no hacemos nada
      if (cat === categoriaActiva && cat !== "Inicio") return;

      let nuevaMostrarMenu = true;
      if (cat === "Inicio" || cat === "Nuestras Sucursales") {
        nuevaMostrarMenu = false;
      }

      // Guardar destino y arrancar animación de salida
      pendienteRef.current = { cat, menu: nuevaMostrarMenu };
      setSaliendo(true);
    },
    [categoriaActiva, isLoggedIn, openAuthWall],
  );

  const totalItems = carrito.reduce((acc, item) => acc + item.cantidad, 0);

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
      className="min-h-screen"
      style={{
        backgroundColor: "rgb(10,10,10)",
        position: "relative",
        overflowX: "hidden",
        overflowY: "auto",
      }}
    >
      {/* Blob de fondo reactivo al scroll */}
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
          ref={blobRef}
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
            willChange: "opacity, border-radius",
            transition: "border-radius 0.3s ease-out, opacity 0.3s ease-out",
          }}
        />
      </div>

      <div style={{ position: "relative", zIndex: 10 }}>
        <Navbar
          categoriaActiva={categoriaActiva}
          onCategoriaClick={handleCategoriaClick}
          totalItems={totalItems}
          onCarritoClick={() => setMostrarCarrito(!mostrarCarrito)}
          isLoggedIn={isLoggedIn}
        />

        {/* Contenedor de vista con clases de animación */}
      </div>

      <div
        key={categoriaActiva} // fuerza re-mount y reinicia la animación de entrada
        className={saliendo ? "seccion-saliendo" : "seccion-entrando"}
      >
        {!mostrarMenu ? (
          <>
            {categoriaActiva === "Nuestras Sucursales" ? (
              <Sucursales />
            ) : (
              <>
                <Hero
                  heroProgress={0}
                  onVerMenu={() => handleCategoriaClick("Entradas")}
                />
                <Descripcion heroProgress={0} />
                <Ubicacion heroProgress={0} />
                <Footer heroProgress={0} />
              </>
            )}
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
                onClose={() => setMostrarCarrito(false)}
              />
            )}
          </div>
        )}
      </div>
      <AuthWall />
      <LoginModal />

      {/* Controles temporales de pruebas */}
      <div className="fixed bottom-4 right-4 z-50 flex gap-2">
        {!isLoggedIn ? (
          <button
            onClick={() => login({ nombre: "Cliente", rol: "cliente" })}
            className="px-3 py-1 bg-[#9B2335] text-white text-xs rounded font-['DM_Sans'] hover:opacity-80 transition-opacity shadow-lg"
          >
            Mock Login Cliente
          </button>
        ) : (
          <button
            onClick={logout}
            className="px-3 py-1 bg-[#3D3530] text-white text-xs rounded font-['DM_Sans'] hover:opacity-80 transition-opacity shadow-lg"
          >
            Logout mock
          </button>
        )}
      </div>
    </div>
  );
}

export default ClienteHomeInner;
