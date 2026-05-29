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
// Importamos el servicio para crear pedidos
import { crearPedidoReal } from "../services/pedidosService";
//
import { useEffect } from "react";
import { getPedidosCliente } from "../services/pedidosService";
import { io } from "socket.io-client";

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

function ConfirmModal({ visible, estado, onConfirmar, onCerrar, ubicacion, setUbicacion }) {
  if (!visible) return null;

  const esConfirmado = estado === "confirmado";

  // Función para leer las coordenadas reales del GPS del navegador
  const detectarGPSReal = () => {
    if (!navigator.geolocation) {
      alert("Tu navegador no soporta geolocalización nativa.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUbicacion({
          latitud: position.coords.latitude,
          longitud: position.coords.longitude,
          tipo: "GPS Real (Navegador)"
        });
      },
      () => {
        alert("No se pudo obtener tu ubicación GPS real. Asegúrate de autorizar los permisos en el navegador.");
      },
      { enableHighAccuracy: true, timeout: 5000 }
    );
  };

  const usarCentro = () => {
    setUbicacion({
      latitud: 17.0600,
      longitud: -96.7260,
      tipo: "Simulada (Oaxaca Centro)"
    });
  };

  const usarReforma = () => {
    setUbicacion({
      latitud: 17.0818,
      longitud: -96.7135,
      tipo: "Simulada (Oaxaca Reforma)"
    });
  };

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
          maxWidth: "360px",
          margin: "0 16px",
          padding: "28px",
          backgroundColor: "#141418",
          border: "1px solid rgba(212, 175, 106, 0.25)",
          textAlign: "center",
          boxShadow: "0 15px 40px rgba(0,0,0,0.6)"
        }}
      >
        <p
          style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: "18px",
            color: "#D4AF6A",
            marginBottom: "8px",
            letterSpacing: "0.1em",
            textTransform: "uppercase"
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
            : "Revisa tu orden y tu geolocalización antes de continuar"}
        </p>

        {!esConfirmado && (
          <>
            {/* Panel de Geolocalización Integrado en el Checkout */}
            <div 
              style={{
                background: "rgba(20, 20, 20, 0.6)",
                border: "1px solid rgba(212, 175, 106, 0.15)",
                padding: "12px",
                marginBottom: "20px",
                textAlign: "left",
                fontFamily: "'Nunito', sans-serif"
              }}
            >
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "9px", color: "#D4AF6A", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                Punto de Entrega (Haversine)
              </span>
              <p style={{ color: "#F2EDE4", fontSize: "12px", margin: "4px 0" }}>
                <strong>Origen:</strong> {ubicacion.tipo}
              </p>
              <p style={{ color: "rgba(242, 242, 244, 0.6)", fontSize: "11px", margin: "2px 0", fontFamily: "'JetBrains Mono', monospace" }}>
                Lat: {ubicacion.latitud.toFixed(4)} | Lon: {ubicacion.longitud.toFixed(4)}
              </p>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginTop: "10px" }}>
                <button
                  type="button"
                  onClick={detectarGPSReal}
                  style={{
                    backgroundColor: "transparent",
                    border: "1px solid rgba(212, 175, 106, 0.4)",
                    color: "#D4AF6A",
                    fontSize: "10px",
                    fontFamily: "'JetBrains Mono', monospace",
                    padding: "6px",
                    cursor: "pointer",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    transition: "all 0.2s"
                  }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = "rgba(212, 175, 106, 0.1)"}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}
                >
                  📡 Detectar GPS Real
                </button>
                <div style={{ display: "flex", gap: "6px" }}>
                  <button
                    type="button"
                    onClick={usarCentro}
                    style={{
                      flex: 1,
                      backgroundColor: "transparent",
                      border: "1px solid rgba(242, 237, 228, 0.2)",
                      color: "rgba(242, 237, 228, 0.8)",
                      fontSize: "9px",
                      fontFamily: "'JetBrains Mono', monospace",
                      padding: "5px",
                      cursor: "pointer"
                    }}
                  >
                    📍 Demo Centro
                  </button>
                  <button
                    type="button"
                    onClick={usarReforma}
                    style={{
                      flex: 1,
                      backgroundColor: "transparent",
                      border: "1px solid rgba(242, 237, 228, 0.2)",
                      color: "rgba(242, 237, 228, 0.8)",
                      fontSize: "9px",
                      fontFamily: "'JetBrains Mono', monospace",
                      padding: "5px",
                      cursor: "pointer"
                    }}
                  >
                    📍 Demo Reforma
                  </button>
                </div>
              </div>
            </div>

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
                  backgroundColor: "#D4AF6A",
                  border: "none",
                  cursor: "pointer",
                  fontWeight: "bold"
                }}
              >
                Confirmar
              </button>
            </div>
          </>
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

    // Ubicación dinámica de entrega para el enrutamiento Haversine
  const [ubicacionCliente, setUbicacionCliente] = useState({
    latitud: 17.0600, // Coordenadas del Zócalo de Oaxaca por defecto
    longitud: -96.7260,
    tipo: "Simulada (Oaxaca Centro)",
  });

  // Socket.IO para actualización en tiempo real de pedidos
    // 1. Cargar el historial real de pedidos al iniciar sesión
  useEffect(() => {
    if (isLoggedIn && user) {
      const cargarHistorialPedidos = async () => {
        try {
          const data = await getPedidosCliente();
          const pedidosFiltrados = data.filter(
            (p) => String(p.clienteId) === String(user.id || user._id)
          );
          setPedidos(pedidosFiltrados);
        } catch (error) {
          console.error("Error al recuperar el historial de pedidos:", error);
        }
      };
      cargarHistorialPedidos();
    }
  }, [isLoggedIn, user]);

  // 2. Conectar WebSocket para recibir actualizaciones del backend
  useEffect(() => {
    if (!isLoggedIn) return undefined;

    // Nos conectamos al API Gateway que actúa como proxy WebSocket
    const socket = io("http://localhost:5000");

    socket.on("connect", () => {
      console.log("[WS] Canal activo con el API Gateway en puerto 5000");
    });

    // Unirse a las salas exclusivas de cada pedido activo para evitar colisiones
    pedidos.forEach((pedido) => {
      const pedidoId = pedido._id || pedido.id;
      if (pedidoId) {
        socket.emit("join_pedido", pedidoId);
      }
    });

    // Escuchar actualizaciones dinámicas de la máquina de estados simulada
    socket.on("pedido_actualizado", (data) => {
      console.log("[WS] Transición de estado del pedido detectada:", data);
      setPedidos((prev) =>
        prev.map((p) => {
          const pId = String(p._id || p.id);
          if (pId === String(data.pedidoId)) {
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
  }, [isLoggedIn, pedidos]);

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
      const prodId = producto._id || producto.id;
      setCarrito((prev) => {
        const existe = prev.find((item) => (item._id || item.id) === prodId);
        if (existe) {
          return prev.map((item) =>
            (item._id || item.id) === prodId
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
        (item._id || item.id) === id ? { ...item, cantidad: item.cantidad + 1 } : item,
      ),
    );
  };

  const decrementar = (id) => {
    setCarrito((prev) => {
      const item = prev.find((i) => (i._id || i.id) === id);
      if (!item) return prev;
      if (item.cantidad === 1) return prev.filter((i) => (i._id || i.id) !== id);
      return prev.map((i) =>
        (i._id || i.id) === id ? { ...i, cantidad: i.cantidad - 1 } : i,
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

   // Lógica de Compra Real conectada al Backend Orquestado
  const ejecutarPedido = async () => {
    if (carrito.length === 0 || !isLoggedIn || !user) return;

    const subtotal = carrito.reduce(
      (a, i) => a + parseFloat(i.precio) * i.cantidad,
      0,
    );
    const servicio = subtotal * 0.1;
    const total = subtotal + servicio;

    try {
      // Coordenadas simuladas del cliente (Cerca de la sucursal Centro de Oaxaca)
      const latitudCliente = 17.0600;
      const longitudCliente = -96.7260;

      // 1. Mapear el carrito al formato esperado por el validador del backend
      const productosPedido = carrito.map(item => ({
        productoId: item._id || item.id, // ID del catálogo de MongoDB
        nombre: item.nombre,
        precioUnitario: parseFloat(item.precio),
        cantidad: item.cantidad
      }));

      // 2. Enviar el pedido al API Gateway
      const nuevoPedidoReal = await crearPedidoReal({
        clienteId: user.id || user._id,
        productos: productosPedido,
        total: total,
        direccionEntrega: {
          calle: user.direccion || "Macedonio Alcalá 402, Centro, Oaxaca",
          ubicacion: { latitud: latitudCliente, longitud: longitudCliente }
        },
        metodoPago: "tarjeta",
        latitud: latitudCliente,   // Se pasan en la raíz del body para el enrutador
        longitud: longitudCliente
      });

      // 3. Agregar el pedido retornado por MongoDB al estado de la vista
      setPedidos((prev) => [nuevoPedidoReal, ...prev]);

      // Limpiar el carrito de compras
      setCarrito([]);
      setMostrarCarrito(false);
      handleCategoriaClick("Pedidos");

      console.log(" Pedido creado y procesado en el Backend:", nuevoPedidoReal);
    } catch (error) {
      console.error(" Error al procesar el pedido: ", error);
      alert(error.response?.data?.message || "Ocurrió un error al procesar tu compra. Por favor verifica el stock de la sucursal.");
    }
  };

  const abrirConfirmacion = () => {
    if (carrito.length === 0) return;
    setEstadoConfirmacion("confirmar");
    setMostrarConfirmacion(true);
  };

  const confirmarPedido = () => {
    ejecutarPedido();
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
          onCarritoClick={() => setMostrarCarrito(!mostrarCarrito)}
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
          </div>
        )}
      </div>

      {mostrarCarrito && (
        <CartPanel
          items={carrito}
          onIncrementar={incrementar}
          onDecrementar={decrementar}
          onConfirmar={abrirConfirmacion}
          onClose={() => setMostrarCarrito(false)}
        />
      )}

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
        ubicacion={ubicacionCliente}
        setUbicacion={setUbicacionCliente}
      />
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
