import { useState } from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import MenuGrid from "../components/MenuGrid";
import CartPanel from "../components/CartPanel";

function ClienteHome() {
  const [categoriaActiva, setCategoriaActiva] = useState("Entradas");
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
      className="min-h-screen"
      style={{ backgroundColor: "rgb(16, 16, 16)" }}
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
        <Hero onVerMenu={() => setMostrarMenu(true)} />
      ) : (
        <div className="pt-20 flex">
          <MenuGrid
            categoriaActiva={categoriaActiva}
            onAgregar={agregarAlCarrito}
          />
        </div>
      )}

      {mostrarCarrito && (
        <CartPanel
          items={carrito}
          onIncrementar={incrementar}
          onDecrementar={decrementar}
          onConfirmar={confirmarPedido}
        />
      )}
    </div>
  );
}

export default ClienteHome;
