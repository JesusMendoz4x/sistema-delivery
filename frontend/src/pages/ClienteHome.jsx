import { useState, useRef, useCallback } from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Descripcion from "../components/Descripcion";
import Ubicacion from "../components/Ubicacion";
import Footer from "../components/Footer";
import MenuGrid from "../components/MenuGrid";
import CartPanel from "../components/CartPanel";
import Sucursales from "../components/Sucursales";
import VistaPedidos from "../components/VistaPedidos";
import { AuthProvider, useAuth } from "../context/AuthContext";
import LoginModal from "../components/LoginModal";
import AuthWall from "../components/AuthWall";

// ── Toast de confirmación ────────────────────────────────────────────────────
function Toast({ mensaje, visible }) {
  if (!visible) return null;
  return (
    <div
      className="fixed z-[100] font-['DM_Sans'] text-[13px]"
      style={{
        bottom: "32px",
        left: "50%",
        transform: "translateX(-50%)",
        background: "rgba(26, 26, 26, 0.97)",
        border: "1px solid rgba(212, 175, 106, 0.35)",
        color: "#F2EDE4",
        padding: "10px 20px",
        backdropFilter: "blur(8px)",
        animation: "toastSlideIn 0.3s ease forwards",
        whiteSpace: "nowrap",
        display: "flex",
        alignItems: "center",
        gap: "8px",
      }}
    >
      <span style={{ color: "#2D7A4F", fontSize: "15px" }}>✓</span>
      {mensaje}
    </div>
  );
}

function ClienteHomeInner() {
  const { isLoggedIn, login, logout, openAuthWall } = useAuth();

  const [categoriaActiva, setCategoriaActiva] = useState("Inicio");
  const [carrito, setCarrito] = useState([]);
  const [mostrarMenu, setMostrarMenu] = useState(false);
  const [mostrarCarrito, setMostrarCarrito] = useState(false);
  const [pedidos, setPedidos] = useState([]);

  // Toast
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMensaje, setToastMensaje] = useState("");
  const toastTimerRef = useRef(null);

  // Bounce del carrito
  const [carritoAnimado, setCarritoAnimado] = useState(false);

  const mostrarToast = useCallback((nombre) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToastMensaje(`${nombre} agregado al carrito`);
    setToastVisible(true);
    // Bounce en el ícono
    setCarritoAnimado(false);
    requestAnimationFrame(() => setCarritoAnimado(true));
    toastTimerRef.current = setTimeout(() => {
      setToastVisible(false);
      setCarritoAnimado(false);
    }, 2200);
  }, []);

  const totalItems = carrito.reduce((acc, item) => acc + item.cantidad, 0);

  const agregarAlCarrito = useCallback(
    (producto) => {
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
      mostrarToast(producto.nombre);
    },
    [mostrarToast],
  );

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
    if (cat === "Pedidos") {
      setMostrarMenu(false);
      setCategoriaActiva("Pedidos");
      return;
    }
    setCategoriaActiva(cat);
    setMostrarMenu(true);
    setMostrarCarrito(false);
  };

  const ejecutarPedido = () => {
    if (carrito.length === 0) return;
    const subtotal = carrito.reduce(
      (a, i) => a + parseFloat(i.precio) * i.cantidad,
      0,
    );
    const servicio = subtotal * 0.1;
    const total = subtotal + servicio;
    setPedidos((prev) => [
      {
        id: Date.now(),
        fecha: new Date().toLocaleDateString("es-MX", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
        estado: "pendiente",
        items: carrito,
        subtotal,
        servicio,
        total,
      },
      ...prev,
    ]);
    setCarrito([]);
    setMostrarCarrito(false);
    handleCategoriaClick("Pedidos");
  };

  return (
    <div
      className="min-h-screen transition-colors duration-300"
      style={{
        backgroundColor: "rgb(10,10,10)",
        position: "relative",
        overflowX: "hidden",
        overflowY: "auto",
      }}
    >
      {/* Blob de fondo */}
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
            willChange: "transform",
          }}
        />
      </div>

      <div style={{ position: "relative", zIndex: 10 }}>
        <Navbar
          categoriaActiva={categoriaActiva}
          onCategoriaClick={handleCategoriaClick}
          totalItems={totalItems}
          onCarritoClick={() =>
            setMostrarCarrito(
              categoriaActiva === "Entradas" ? !mostrarCarrito : false,
            )
          }
          isLoggedIn={isLoggedIn}
          carritoAnimado={carritoAnimado}
        />

        {categoriaActiva === "Pedidos" ? (
          <VistaPedidos pedidos={pedidos} onConfirmarPedido={ejecutarPedido} />
        ) : !mostrarMenu ? (
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
            {categoriaActiva === "Entradas" && mostrarCarrito && (
              <CartPanel
                items={carrito}
                onIncrementar={incrementar}
                onDecrementar={decrementar}
                onConfirmar={ejecutarPedido}
                onClose={() => setMostrarCarrito(false)}
              />
            )}
          </div>
        )}
      </div>

      {/* Toast de confirmación */}
      <Toast visible={toastVisible} mensaje={toastMensaje} />

      {/* Modales */}
      <AuthWall />
      <LoginModal />

      {/* Controles mock — eliminar cuando auth esté conectado */}
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

function ClienteHome() {
  return (
    <AuthProvider>
      <ClienteHomeInner />
    </AuthProvider>
  );
}

export default ClienteHome;
