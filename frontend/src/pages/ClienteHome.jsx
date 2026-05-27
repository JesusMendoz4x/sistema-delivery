import { useState, useEffect } from "react";
import io from "socket.io-client";
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

function ClienteHomeInner() {
  const { isLoggedIn, login, logout, openAuthWall } = useAuth();

  const [categoriaActiva, setCategoriaActiva] = useState("Inicio");
  const [carrito, setCarrito] = useState([]);
  const [mostrarMenu, setMostrarMenu] = useState(false);
  const [mostrarCarrito, setMostrarCarrito] = useState(false);
  const [pedidos, setPedidos] = useState([]);

  // Escuchar actualizaciones del pedido en tiempo real mediante WebSockets
  useEffect(() => {
    const socket = io("http://localhost:5000");

    socket.on("connect", () => {
      console.log("[WS] Conectado al API Gateway via WebSocket");
    });

    // Registrar unión a sala de cada pedido para recibir actualizaciones
    pedidos.forEach(pedido => {
      socket.emit("join_pedido", pedido.id);
    });

    socket.on("pedido_actualizado", (data) => {
      console.log("[WS] Pedido actualizado recibido:", data);
      setPedidos((prev) => 
        prev.map((p) => {
          if (String(p.id) === String(data.pedidoId)) {
            return {
              ...p,
              estado: data.estado,
              repartidorId: data.repartidorId,
              ruta: data.ruta
            };
          }
          return p;
        })
      );
    });

    return () => {
      socket.disconnect();
    };
  }, [pedidos]);

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

  // ⚠️ handleCategoriaClick ANTES de ejecutarPedido para que pueda llamarla
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
          onCategoriaClick={handleCategoriaClick}
          totalItems={totalItems}
          onCarritoClick={() => setMostrarCarrito(!mostrarCarrito)}
          isLoggedIn={isLoggedIn}
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
            {mostrarCarrito && (
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

      {/* Modales — montados via portal, fuera del stacking context */}
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
