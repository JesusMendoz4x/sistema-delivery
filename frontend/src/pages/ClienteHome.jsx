import { useState } from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Descripcion from "../components/Descripcion";
import Ubicacion from "../components/Ubicacion";
import Footer from "../components/Footer";
import MenuGrid from "../components/MenuGrid";
import CartPanel from "../components/CartPanel";
import { AuthProvider, useAuth } from "../context/AuthContext";

// Componente interno separado para poder consumir useAuth
// dentro del árbol del AuthProvider
function ClienteHomeInner() {
  const { isLoggedIn, login, logout } = useAuth();

  const [categoriaActiva, setCategoriaActiva] = useState("Inicio");
  const [carrito, setCarrito] = useState([]);
  const [mostrarMenu, setMostrarMenu] = useState(false);
  const [mostrarCarrito, setMostrarCarrito] = useState(false);

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
      className="min-h-screen transition-colors duration-300"
      style={{
        backgroundColor: "rgb(10,10,10)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Ellipse de fondo */}
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
          isLoggedIn={isLoggedIn}
        />

        {!mostrarMenu ? (
          <>
            <Hero heroProgress={0} onVerMenu={() => setMostrarMenu(true)} />
            <Descripcion heroProgress={0} />
            <Ubicacion heroProgress={0} />
            <Footer heroProgress={0} />
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

      {/* Botones mock — eliminar cuando el backend de auth esté listo */}
      <div className="fixed bottom-4 right-4 z-50 flex gap-2">
        <button
          onClick={() => login({ nombre: "Cliente" })}
          className="px-3 py-1 bg-[#9B2335] text-white text-xs rounded font-['DM_Sans'] hover:opacity-80 transition-opacity"
        >
          Login mock
        </button>
        <button
          onClick={logout}
          className="px-3 py-1 bg-[#3D3530] text-white text-xs rounded font-['DM_Sans'] hover:opacity-80 transition-opacity"
        >
          Logout mock
        </button>
      </div>
    </div>
  );
}

// Wrapper que provee el contexto
function ClienteHome() {
  return (
    <AuthProvider>
      <ClienteHomeInner />
    </AuthProvider>
  );
}

export default ClienteHome;
