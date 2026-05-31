import { useState, useEffect } from "react";
import AdminModal from "../../components/AdminModal";
import { getProductos, createProducto, updateProducto, deleteProducto } from "../../services/productosService";

function AdminProductos() {
  const [productos, setProductos] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [imagePreview, setImagePreview] = useState("");

  const fetchProductos = async () => {
    setIsLoading(true);
    try {
      const data = await getProductos();
      setProductos(data);
    } catch (error) {
      console.error("Error al cargar productos", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let activo = true;

    (async () => {
      try {
        const data = await getProductos();
        if (activo) {
          setProductos(data);
        }
      } catch (error) {
        console.error("Error al cargar productos", error);
      } finally {
        if (activo) {
          setIsLoading(false);
        }
      }
    })();

    return () => {
      activo = false;
    };
  }, []);

  const handleAdd = () => {
    setCurrentProduct(null);
    setImagePreview("");
    setIsModalOpen(true);
  };

  const handleEdit = (prod) => {
    setCurrentProduct(prod);
    setImagePreview(prod?.imagen || "");
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if(window.confirm("¿Estás seguro de eliminar este producto?")) {
      await deleteProducto(id);
      await fetchProductos();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const payload = new FormData();

    payload.append("nombre", formData.get("nombre") || "");
    payload.append("precio", String(parseFloat(formData.get("precio") || "0")));
    payload.append("categoria", formData.get("categoria") || "");
    payload.append("icono", formData.get("icono") || "restaurant");
    payload.append("destacado", formData.get("destacado") === "on" ? "on" : "off");

    const imagenArchivo = formData.get("imagenArchivo");
    if (imagenArchivo && imagenArchivo.size > 0) {
      payload.append("imagenArchivo", imagenArchivo);
    }

    const descripcion = formData.get("descripcion") || "";
    if (descripcion) {
      payload.append("descripcion", descripcion);
    }

    try {
      if (currentProduct) {
        await updateProducto(currentProduct._id || currentProduct.id, payload);
      } else {
        await createProducto(payload);
      }
      setIsModalOpen(false);
      await fetchProductos();
    } catch (error) {
      console.error("Error al guardar", error);
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      setImagePreview(currentProduct?.imagen || "");
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
  };

  useEffect(() => {
    return () => {
      if (imagePreview?.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

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
      
      {isLoading ? (
        <div className="text-center text-[#D4AF6A] font-['JetBrains_Mono'] mt-20">Cargando catálogo...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {productos.map((prod) => (
            <div key={prod._id || prod.id} className="bg-[#141414]/60 border border-[#D4AF6A]/20 p-6 rounded-xl relative group hover:border-[#D4AF6A]/50 hover:-translate-y-1 transition-all duration-300 shadow-[0_8px_30px_rgba(0,0,0,0.4)] backdrop-blur-md">
              
              {prod.destacado && (
                <div className="absolute -top-3 -left-3 px-3 py-1 bg-[#D4AF6A] text-[#101010] text-[9px] font-bold tracking-widest uppercase font-['JetBrains_Mono'] shadow-lg rounded">
                  Signature
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
                  onClick={() => handleDelete(prod._id || prod.id)}
                  className="w-8 h-8 rounded-full bg-[#1a1a1a] border border-[#9B2335]/30 flex items-center justify-center text-[#9B2335]/70 hover:text-[#9B2335] hover:bg-[#9B2335]/10 transition-colors shadow-lg"
                >
                  <span className="material-symbols-outlined text-[16px] font-light">delete</span>
                </button>
              </div>

              <div className="flex items-center gap-5 mt-2 mb-6">
                <div className="w-16 h-16 bg-[#1a1a1a] rounded-lg overflow-hidden border border-[#D4AF6A]/20 shadow-inner flex items-center justify-center">
                  {prod.imagen ? (
                    <img
                      src={prod.imagen}
                      alt={prod.nombre}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <span className="material-symbols-outlined text-3xl font-light text-[#D4AF6A] opacity-90">{prod.icono}</span>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-['Outfit'] text-[16px] text-[#F2EDE4] font-semibold">{prod.nombre}</h3>
                  <p className="font-['JetBrains_Mono'] text-[#D4AF6A] mt-1 text-[13px] tracking-wider font-bold">
                    ${prod.precio.toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#D4AF6A]/10">
                <div className="flex flex-col gap-1">
                  <span className="font-['JetBrains_Mono'] text-[9px] uppercase tracking-[0.2em] text-[#D4AF6A]/50">Categoría</span>
                  <span className="font-['JetBrains_Mono'] text-[11px] tracking-wider text-[#F2EDE4]/70">
                    {prod.categoria}
                  </span>
                </div>
                <div className="flex flex-col gap-1 items-end">
                  <span className="font-['JetBrains_Mono'] text-[9px] uppercase tracking-[0.2em] text-[#D4AF6A]/50">ID</span>
                  <span className="font-['JetBrains_Mono'] text-[10px] text-[#F2EDE4]/30">
                    #{String(prod._id || prod.id || '').slice(-6).toUpperCase()}
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
        {/* El atributo name="" en los inputs es crucial para que el FormData funcione */}
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

          <div>
            <label className="block text-[#D4AF6A]/70 font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.2em] mb-2">Descripción</label>
            <textarea
              name="descripcion"
              defaultValue={currentProduct?.descripcion || ""}
              rows="4"
              className="w-full bg-[#1a1a1a] border border-[#D4AF6A]/20 rounded-lg px-4 py-2.5 text-[#F2EDE4] font-['Nunito'] text-sm focus:outline-none focus:border-[#D4AF6A]/50 transition-colors resize-none"
              placeholder="Describe el producto..."
            />
          </div>

          <div>
            <label className="block text-[#D4AF6A]/90 font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.2em] mb-2">Imagen del Producto</label>
            <input 
              type="file" 
              name="imagenArchivo"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full rounded-lg border border-dashed border-[#D4AF6A]/35 bg-[#1a1a1a] px-4 py-3 text-sm text-[#F2EDE4]/90 font-['Nunito'] file:mr-4 file:rounded-md file:border-0 file:bg-[#D4AF6A] file:px-4 file:py-2 file:font-['JetBrains_Mono'] file:text-[10px] file:uppercase file:tracking-[0.18em] file:text-[#101010] hover:border-[#D4AF6A]/60 focus:outline-none focus:ring-1 focus:ring-[#D4AF6A]/50 transition-colors" 
            />
            <p className="mt-2 text-[11px] text-[#F2EDE4]/70 font-['Nunito'] leading-relaxed">
              Carga una imagen del nuevo producto.
            </p>
          </div>

          {imagePreview && (
            <div className="rounded-xl overflow-hidden border border-[#D4AF6A]/15 bg-[#111111]">
              <img
                src={imagePreview}
                alt={currentProduct?.nombre || "Vista previa del producto"}
                className="w-full h-44 object-cover"
              />
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="block text-[#D4AF6A]/70 font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.2em] mb-2">Precio ($)</label>
              <input 
                type="number" 
                name="precio"
                step="0.01"
                defaultValue={currentProduct?.precio || ""} 
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
                <option value="Entradas">Entradas</option>
                <option value="Plato Principal">Plato Principal</option>
                <option value="Sushi">Sushi</option>
                <option value="Postres">Postres</option>
                <option value="Bebidas">Bebidas</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[#D4AF6A]/70 font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.2em] mb-2">Ícono (Material Symbol)</label>
            <input 
              type="text" 
              name="icono"
              defaultValue={currentProduct?.icono || "restaurant"} 
              className="w-full bg-[#1a1a1a] border border-[#D4AF6A]/20 rounded-lg px-4 py-2.5 text-[#F2EDE4] font-['Nunito'] text-sm focus:outline-none focus:border-[#D4AF6A]/50 transition-colors" 
              placeholder="Ej. set_meal, ramen_dining"
            />
          </div>

          <div className="flex items-center gap-3 mt-4 pt-4 border-t border-[#D4AF6A]/10">
            <input 
              type="checkbox" 
              name="destacado"
              id="destacado" 
              defaultChecked={currentProduct?.destacado || false}
              className="w-4 h-4 accent-[#D4AF6A] bg-[#1a1a1a] border-[#D4AF6A]/30 rounded"
            />
            <label htmlFor="destacado" className="text-[#F2EDE4]/70 font-['Nunito'] text-sm">
              Marcar como platillo "Signature" (Destacado)
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
