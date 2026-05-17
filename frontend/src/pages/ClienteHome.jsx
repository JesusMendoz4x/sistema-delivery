import { useState, useEffect } from "react";
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

  const totalItems = carrito.reduce((acc, item) => acc + item.cantidad, 0);

  useEffect(() => {
    const handleScroll = () => {
      // Only update the hero color while the menu is hidden
      if (mostrarMenu) return;

      const heroEl = document.getElementById("hero");
      const heroHeight = (heroEl && heroEl.offsetHeight) || window.innerHeight;
      const scrollY = window.scrollY;

      // Progress only across the hero height for smoother control
      let progress = Math.min(Math.max(scrollY / heroHeight, 0), 1);

      // Ease-out for smoother feel
      const eased = 1 - Math.cos((progress * Math.PI) / 2);

      // Only update heroProgress; do not change global page background
      setHeroProgress(eased);
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
      style={{ backgroundColor: "rgb(16,16,16)" }}
    >
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
            <Descripcion heroProgress={heroProgress} />
            <Ubicacion heroProgress={heroProgress} />
            <Footer heroProgress={heroProgress} />
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
