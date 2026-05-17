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
  const [bgColor, setBgColor] = useState("rgb(16, 16, 16)");

  const totalItems = carrito.reduce((acc, item) => acc + item.cantidad, 0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll = document.body.scrollHeight - window.innerHeight;

      // Normaliza entre 0 y 1
      const progress = Math.min(scrollY / maxScroll, 1);

      // Oscila entre negro y rojo oscuro
      const cycle = Math.sin(progress * Math.PI * 3) * 0.5 + 0.5;

      const r = Math.round(16 + cycle * 106); // 16 → 122  (rojo vino)
      const g = Math.round(16 - cycle * 11); // 16 → 5
      const b = Math.round(16 + cycle * 16); // 16 → 32   (toque púrpura)

      setBgColor(`rgb(${r}, ${g}, ${b})`);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
      style={{ backgroundColor: bgColor }}
    >
      <Navbar
        categoriaActiva={categoriaActiva}
        onCategoriaClick={(cat) => {
          setCategoriaActiva(cat);
          setMostrarMenu(true);
        }}
        totalItems={totalItems}
        onCarritoClick={() => setMostrarCarrito(!mostrarCarrito)}
      />

      {!mostrarMenu ? (
        <>
          <Hero onVerMenu={() => setMostrarMenu(true)} />
          <Descripcion />
          <Ubicacion />
          <Footer />
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
  );
}

export default ClienteHome;
