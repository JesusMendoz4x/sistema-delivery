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
import { useAuth } from "../context/AuthContext";
import { crearPedido } from "../services/pedidosService";
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

function ConfirmModal({ visible, estado, onConfirmar, onCerrar }) {
  if (!visible) return null;

  const esConfirmado = estado === "confirmado";

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget && !esConfirmado) onCerrar();
      }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(10, 10, 10, 0.78)",
        backdropFilter: "blur(6px)",
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "340px",
          margin: "0 16px",
          padding: "28px",
          backgroundColor: "#141418",
          border: "1px solid rgba(226, 227, 230, 0.15)",
          textAlign: "center",
        }}
      >
        <p
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "16px",
            color: "#F2F2F4",
            marginBottom: "8px",
          }}
        >
          {esConfirmado ? "Pedido confirmado" : "Confirmar pedido"}
        </p>
        <p
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "13px",
            color: "rgba(242, 242, 244, 0.65)",
            marginBottom: "20px",
          }}
        >
          {esConfirmado
            ? "Tu pedido fue registrado correctamente"
            : "Revisa tu orden antes de continuar"}
        </p>

        {!esConfirmado && (
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={onCerrar}
              style={{
                flex: 1,
                padding: "10px",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "13px",
                color: "rgba(242, 242, 244, 0.75)",
                backgroundColor: "transparent",
                border: "1px solid rgba(226, 227, 230, 0.2)",
                cursor: "pointer",
              }}
            >
              Cancelar
            </button>
            <button
              onClick={onConfirmar}
              style={{
                flex: 1,
                padding: "10px",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "13px",
                color: "#0B0B0E",
                backgroundColor: "#D95F5F",
                border: "none",
                cursor: "pointer",
              }}
            >
              Confirmar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function ClienteHomeInner() {
  const { isLoggedIn, user, openAuthWall } = useAuth();

  const [categoriaActiva, setCategoriaActiva] = useState("Inicio");
  const [carrito, setCarrito] = useState([]);
  const [mostrarMenu, setMostrarMenu] = useState(false);
  const [mostrarCarrito, setMostrarCarrito] = useState(false);
  const [pedidos, setPedidos] = useState([]);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [estadoConfirmacion, setEstadoConfirmacion] = useState("confirmar");

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

  // Mapea el estado del backend a las claves que usa la línea de tiempo del cliente.
  const mapearEstado = (estado) => {
    switch (estado) {
      case "preparando":
        return "en_preparacion";
      case "en_camino":
        return "listo";
      case "entregado":
        return "entregado";
      default:
        return "pendiente";
    }
  };

  const ejecutarPedido = async () => {
    if (carrito.length === 0) return;

    const subtotal = carrito.reduce(
      (a, i) => a + parseFloat(i.precio) * i.cantidad,
      0,
    );
    const servicio = subtotal * 0.1;
    const total = subtotal + servicio;

    // Construye el payload real para el orquestador de pedidos.
    const payload = {
      clienteId: user?.id || user?._id || "cliente-anonimo",
      productos: carrito.map((item) => ({
        productoId: item.id,
        nombre: item.nombre,
        precioUnitario: parseFloat(item.precio) || 0,
        cantidad: item.cantidad,
      })),
      total: parseFloat(total.toFixed(2)),
      direccionEntrega: user?.direccion || "Sucursal Centro, Oaxaca",
      metodoPago: "efectivo",
    };

    const fecha = new Date().toLocaleDateString("es-MX", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    try {
      const pedido = await crearPedido(payload);
      // El pedido se creó realmente en el backend (descontó stock y asignó sucursal/repartidor).
      setPedidos((prev) => [
        {
          id: pedido.id,
          fecha,
          estado: mapearEstado(pedido.estado),
          items: carrito,
          subtotal,
          servicio,
          total: pedido.total ?? total,
        },
        ...prev,
      ]);
      setCarrito([]);
      setMostrarCarrito(false);
      setToastMensaje("Pedido enviado a la sucursal");
      setToastVisible(true);
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
      toastTimerRef.current = setTimeout(() => setToastVisible(false), 2400);
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        "No se pudo registrar el pedido. Intenta de nuevo.";
      setToastMensaje(msg);
      setToastVisible(true);
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
      toastTimerRef.current = setTimeout(() => setToastVisible(false), 3000);
    }
  };

  const abrirConfirmacion = () => {
    if (carrito.length === 0) return;
    setEstadoConfirmacion("confirmar");
    setMostrarConfirmacion(true);
  };

  const confirmarPedido = async () => {
    await ejecutarPedido();
    setEstadoConfirmacion("confirmado");
    setTimeout(() => {
      setMostrarConfirmacion(false);
      handleCategoriaClick("Pedidos");
    }, 1200);
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
                onConfirmar={abrirConfirmacion}
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
      <ConfirmModal
        visible={mostrarConfirmacion}
        estado={estadoConfirmacion}
        onConfirmar={confirmarPedido}
        onCerrar={() => setMostrarConfirmacion(false)}
      />
    </div>
  );
}

function ClienteHome() {
  return <ClienteHomeInner />;
}

export default ClienteHome;
