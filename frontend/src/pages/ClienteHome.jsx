import { useState, useEffect, useRef } from "react";
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

function ClienteHomeInner() {
  const { isLoggedIn, login, logout, openAuthWall } = useAuth();

  const [categoriaActiva, setCategoriaActiva] = useState("Inicio");
  const [carrito, setCarrito] = useState([]);
  const [mostrarMenu, setMostrarMenu] = useState(false);
  const [mostrarCarrito, setMostrarCarrito] = useState(false);

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
          const progress = Math.min(y / maxScroll, 1); // 0 a 1

          if (blobRef.current) {
            // Opacidad — alta al inicio, baja a mitad, sube al final
            const opacity = 0.95 - Math.sin(progress * Math.PI) * 0.6;

            // Forma — cambia de círculo a elipse alargada según scroll
            const rx1 = 50 + progress * 20; // 50% → 70%
            const ry1 = 50 - progress * 25; // 50% → 25%
            const rx2 = 50 - progress * 20; // 50% → 30%
            const ry2 = 50 + progress * 25; // 50% → 75%
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

  const handleCategoriaClick = (cat) => {
    if (cat === "Pedidos" && !isLoggedIn) {
      openAuthWall("pedidos");
      return;
    }
    if (cat === "Inicio") {
      setMostrarMenu(false);
      setCategoriaActiva("Inicio");
      return;
    }
    if (cat === "Nuestras Sucursales") {
      setMostrarMenu(false);
      setCategoriaActiva("Nuestras Sucursales");
      return;
    }
    setCategoriaActiva(cat);
    setMostrarMenu(true);
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

        {!mostrarMenu ? (
          <>
            {categoriaActiva === "Nuestras Sucursales" ? (
              <Sucursales />
            ) : (
              <>
                <Hero heroProgress={0} onVerMenu={() => setMostrarMenu(true)} />
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
