import { useState, useEffect } from "react";
import AdminModal from "../../components/AdminModal";
import {
  getProductos,
  createProducto,
  updateProducto,
  deleteProducto,
} from "../../services/productosService";

// Categorías reales que usa la tienda (deben coincidir para que el producto
// aparezca en su sección del menú del cliente).
const CATEGORIAS = [
  "Entradas",
  "Sushi & Sashimi",
  "Dumplings",
  "Especialidades",
  "Postres",
];

function AdminProductos() {
  const [productos, setProductos] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProductos = async () => {
    try {
      const data = await getProductos();
      setProductos(data);
      setError("");
    } catch (err) {
      console.error("Error al cargar productos", err);
      setError("No se pudo cargar el catálogo desde el servidor.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  const handleAdd = () => {
    setCurrentProduct(null);
    setIsModalOpen(true);
  };

  const handleEdit = (prod) => {
    setCurrentProduct(prod);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar este producto?")) {
      try {
        await deleteProducto(id);
        await fetchProductos();
      } catch (err) {
        console.error("Error al eliminar", err);
        window.alert("No se pudo eliminar el producto.");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    // Empata el payload con el modelo del backend.
    const payload = {
      nombre: data.nombre,
      descripcion: data.descripcion || "",
      categoria: data.categoria,
      precio: parseFloat(data.precio),
      disponible: formData.get("disponible") === "on",
    };

    try {
      if (currentProduct) {
        await updateProducto(currentProduct.id, payload);
      } else {
        await createProducto(payload);
      }
      setIsModalOpen(false);
      await fetchProductos();
    } catch (err) {
      console.error("Error al guardar", err);
      window.alert(
        err.response?.data?.message || "No se pudo guardar el producto.",
      );
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-[24px] font-['Outfit'] text-[#F2EDE4] tracking-widest uppercase">
          Catálogo de Productos
        </h2>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 bg-[#9B2335] text-white px-6 py-2.5 rounded hover:opacity-80 transition-opacity shadow-[0_4px_14px_rgba(155,35,53,0.4)]"
        >
          <span className="material-symbols-outlined font-light text-[18px]">add</span>
          <span className="font-['Nunito'] text-[13px] font-bold tracking-wide">Nuevo Producto</span>
        </button>
      </div>

      {error && (
        <div className="mb-6 text-[#E57474] font-['JetBrains_Mono'] text-[12px] uppercase tracking-widest">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="text-center text-[#D4AF6A] font-['JetBrains_Mono'] mt-20">Cargando catálogo...</div>
      ) : productos.length === 0 ? (
        <div className="text-center text-[#F2EDE4]/40 font-['Nunito'] mt-20">
          No hay productos en el catálogo. Crea el primero con "Nuevo Producto".
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {productos.map((prod) => (
            <div key={prod.id} className="bg-[#141414]/60 border border-[#D4AF6A]/20 p-6 rounded-xl relative group hover:border-[#D4AF6A]/50 hover:-translate-y-1 transition-all duration-300 shadow-[0_8px_30px_rgba(0,0,0,0.4)] backdrop-blur-md">

              {!prod.disponible && (
                <div className="absolute -top-3 -left-3 px-3 py-1 bg-[#9B2335] text-[#F2EDE4] text-[9px] font-bold tracking-widest uppercase font-['JetBrains_Mono'] shadow-lg rounded">
                  Agotado
                </div>
              )}

              <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleEdit(prod)}
                  className="w-8 h-8 rounded-full bg-[#1a1a1a] border border-[#D4AF6A]/30 flex items-center justify-center text-[#D4AF6A]/70 hover:text-[#D4AF6A] hover:bg-[#D4AF6A]/10 transition-colors shadow-lg"
                >
                  <span className="material-symbols-outlined text-[16px] font-light">edit</span>
                </button>
                <button
                  onClick={() => handleDelete(prod.id)}
                  className="w-8 h-8 rounded-full bg-[#1a1a1a] border border-[#9B2335]/30 flex items-center justify-center text-[#9B2335]/70 hover:text-[#9B2335] hover:bg-[#9B2335]/10 transition-colors shadow-lg"
                >
                  <span className="material-symbols-outlined text-[16px] font-light">delete</span>
                </button>
              </div>

              <div className="flex items-center gap-5 mt-2 mb-4">
                <div className="w-16 h-16 bg-[#1a1a1a] rounded-lg flex items-center justify-center text-[#D4AF6A] border border-[#D4AF6A]/20 shadow-inner">
                  <span className="material-symbols-outlined text-3xl font-light opacity-90">restaurant</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-['Outfit'] text-[16px] text-[#F2EDE4] font-semibold">{prod.nombre}</h3>
                  <p className="font-['JetBrains_Mono'] text-[#D4AF6A] mt-1 text-[13px] tracking-wider font-bold">
                    ${prod.precio.toFixed(2)}
                  </p>
                </div>
              </div>

              {prod.descripcion && (
                <p className="font-['Nunito'] text-[#F2EDE4]/50 text-[12px] leading-relaxed line-clamp-2 mb-4">
                  {prod.descripcion}
                </p>
              )}

              <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#D4AF6A]/10">
                <div className="flex flex-col gap-1">
                  <span className="font-['JetBrains_Mono'] text-[9px] uppercase tracking-[0.2em] text-[#D4AF6A]/50">Categoría</span>
                  <span className="font-['JetBrains_Mono'] text-[11px] tracking-wider text-[#F2EDE4]/70">
                    {prod.categoria}
                  </span>
                </div>
                <div className="flex flex-col gap-1 items-end">
                  <span className="font-['JetBrains_Mono'] text-[9px] uppercase tracking-[0.2em] text-[#D4AF6A]/50">Estado</span>
                  <span className={`font-['JetBrains_Mono'] text-[10px] ${prod.disponible ? "text-[#D4AF6A]" : "text-[#F2EDE4]/30"}`}>
                    {prod.disponible ? "Disponible" : "No disponible"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <AdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentProduct ? "Editar Producto" : "Nuevo Producto"}
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-[#D4AF6A]/70 font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.2em] mb-2">Nombre del Producto</label>
            <input
              type="text"
              name="nombre"
              defaultValue={currentProduct?.nombre || ""}
              required
              className="w-full bg-[#1a1a1a] border border-[#D4AF6A]/20 rounded-lg px-4 py-2.5 text-[#F2EDE4] font-['Nunito'] text-sm focus:outline-none focus:border-[#D4AF6A]/50 transition-colors"
              placeholder="Ej. Sushi Mix"
            />
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="block text-[#D4AF6A]/70 font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.2em] mb-2">Precio ($)</label>
              <input
                type="number"
                name="precio"
                step="0.01"
                min="0"
                defaultValue={currentProduct?.precio ?? ""}
                required
                className="w-full bg-[#1a1a1a] border border-[#D4AF6A]/20 rounded-lg px-4 py-2.5 text-[#F2EDE4] font-['Nunito'] text-sm focus:outline-none focus:border-[#D4AF6A]/50 transition-colors"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-[#D4AF6A]/70 font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.2em] mb-2">Categoría</label>
              <select
                name="categoria"
                defaultValue={currentProduct?.categoria || ""}
                required
                className="w-full bg-[#1a1a1a] border border-[#D4AF6A]/20 rounded-lg px-4 py-2.5 text-[#F2EDE4] font-['Nunito'] text-sm focus:outline-none focus:border-[#D4AF6A]/50 transition-colors appearance-none"
              >
                <option value="" disabled>Seleccionar...</option>
                {CATEGORIAS.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[#D4AF6A]/70 font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.2em] mb-2">Descripción</label>
            <textarea
              name="descripcion"
              defaultValue={currentProduct?.descripcion || ""}
              rows={3}
              className="w-full bg-[#1a1a1a] border border-[#D4AF6A]/20 rounded-lg px-4 py-2.5 text-[#F2EDE4] font-['Nunito'] text-sm focus:outline-none focus:border-[#D4AF6A]/50 transition-colors resize-none"
              placeholder="Breve descripción del platillo"
            />
          </div>

          <div className="flex items-center gap-3 mt-4 pt-4 border-t border-[#D4AF6A]/10">
            <input
              type="checkbox"
              name="disponible"
              id="disponible"
              defaultChecked={currentProduct ? currentProduct.disponible : true}
              className="w-4 h-4 accent-[#D4AF6A] bg-[#1a1a1a] border-[#D4AF6A]/30 rounded"
            />
            <label htmlFor="disponible" className="text-[#F2EDE4]/70 font-['Nunito'] text-sm">
              Disponible para venta en la tienda
            </label>
          </div>

          <div className="pt-6 mt-6 flex justify-end gap-3 border-t border-[#D4AF6A]/10">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-5 py-2.5 rounded-lg font-['Nunito'] text-[13px] text-[#F2EDE4]/70 hover:bg-[#F2EDE4]/10 hover:text-[#F2EDE4] transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-[#D4AF6A] text-[#101010] px-6 py-2.5 rounded-lg font-['Nunito'] text-[13px] font-bold hover:opacity-90 transition-opacity shadow-[0_4px_14px_rgba(212,175,106,0.3)]"
            >
              {currentProduct ? "Actualizar Producto" : "Crear Producto"}
            </button>
          </div>
        </form>
      </AdminModal>
    </div>
  );
}
export default AdminProductos;
