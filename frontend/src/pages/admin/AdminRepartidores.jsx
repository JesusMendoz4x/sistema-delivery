import { useState, useEffect } from "react";
import AdminModal from "../../components/AdminModal";
import {
  getRepartidores,
  createRepartidor,
  updateRepartidor,
  activarRepartidor,
  desactivarRepartidor,
} from "../../services/repartidoresService";

// Tipos de vehículo válidos en el backend (enum del modelo Repartidor).
const VEHICULOS = ["motocicleta", "bicicleta", "automóvil", "a pie"];

// Ubicación por defecto (Sucursal Centro) — el backend exige lat/lng al crear.
const UBICACION_DEFAULT = { latitud: 17.0604, longitud: -96.7266 };

const estadoLabel = {
  disponible: "Disponible",
  en_ruta: "En Ruta",
  inactivo: "Fuera de Servicio",
};

function AdminRepartidores() {
  const [repartidores, setRepartidores] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [current, setCurrent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchRepartidores = async () => {
    try {
      const data = await getRepartidores();
      setRepartidores(data);
      setError("");
    } catch (err) {
      console.error("Error al cargar repartidores", err);
      setError("No se pudieron cargar los repartidores.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRepartidores();
  }, []);

  const getEstadoColor = (estado) => {
    switch (estado) {
      case "disponible": return "text-[#D4AF6A] bg-[#D4AF6A]/10 border-[#D4AF6A]/30";
      case "en_ruta": return "text-blue-400 bg-blue-500/10 border-blue-500/30";
      case "inactivo": return "text-[#F2EDE4]/50 bg-[#F2EDE4]/5 border-[#F2EDE4]/20";
      default: return "";
    }
  };

  const getEstadoIcono = (estado) => {
    switch (estado) {
      case "disponible": return "check_circle";
      case "en_ruta": return "two_wheeler";
      case "inactivo": return "block";
      default: return "person";
    }
  };

  const handleEdit = (rep) => {
    setCurrent(rep);
    setIsModalOpen(true);
  };

  const toggleEstado = async (rep) => {
    try {
      if (rep.estado === "inactivo") {
        await activarRepartidor(rep.id);
      } else {
        await desactivarRepartidor(rep.id);
      }
      await fetchRepartidores();
    } catch (err) {
      console.error("Error al cambiar estado", err);
      window.alert("No se pudo cambiar el estado del repartidor.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    const payload = {
      nombre: data.nombre,
      email: data.email,
      telefono: data.telefono,
      vehiculo: { tipo: data.vehiculoTipo, placa: data.placa || "" },
    };

    try {
      if (current) {
        if (data.estado) payload.estado = data.estado;
        await updateRepartidor(current.id, payload);
      } else {
        // El backend exige ubicación al crear: usamos la de la sucursal central.
        payload.ubicacion = UBICACION_DEFAULT;
        await createRepartidor(payload);
      }
      setIsModalOpen(false);
      await fetchRepartidores();
    } catch (err) {
      console.error("Error al guardar repartidor", err);
      window.alert(
        err.response?.data?.message || "No se pudo guardar el repartidor.",
      );
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-[24px] font-['Outfit'] text-[#F2EDE4] tracking-widest uppercase">
          Logística y Flotilla
        </h2>
        <button
          onClick={() => { setCurrent(null); setIsModalOpen(true); }}
          className="flex items-center gap-2 bg-[#9B2335] text-white px-6 py-2.5 rounded hover:opacity-80 transition-opacity shadow-[0_4px_14px_rgba(155,35,53,0.4)]"
        >
          <span className="material-symbols-outlined font-light text-[18px]">person_add</span>
          <span className="font-['Nunito'] text-[13px] font-bold tracking-wide">Alta de Repartidor</span>
        </button>
      </div>

      {error && (
        <div className="mb-6 text-[#E57474] font-['JetBrains_Mono'] text-[12px] uppercase tracking-widest">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="text-center text-[#D4AF6A] font-['JetBrains_Mono'] mt-20">Cargando flotilla...</div>
      ) : repartidores.length === 0 ? (
        <div className="text-center text-[#F2EDE4]/40 font-['Nunito'] mt-20">No hay repartidores registrados.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {repartidores.map((rep) => (
            <div key={rep.id} className="bg-[#141414]/60 border border-[#D4AF6A]/20 p-6 rounded-xl relative group hover:border-[#D4AF6A]/50 hover:-translate-y-1 transition-all duration-300 shadow-[0_8px_30px_rgba(0,0,0,0.4)] backdrop-blur-md">

              <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleEdit(rep)}
                  className="w-8 h-8 rounded-full bg-[#1a1a1a] border border-[#D4AF6A]/30 flex items-center justify-center text-[#D4AF6A]/70 hover:text-[#D4AF6A] hover:bg-[#D4AF6A]/10 transition-colors shadow-lg"
                >
                  <span className="material-symbols-outlined text-[16px] font-light">edit</span>
                </button>
                <button
                  onClick={() => toggleEstado(rep)}
                  title={rep.estado === "inactivo" ? "Activar" : "Dar de baja"}
                  className="w-8 h-8 rounded-full bg-[#1a1a1a] border border-[#9B2335]/30 flex items-center justify-center text-[#9B2335]/70 hover:text-[#9B2335] hover:bg-[#9B2335]/10 transition-colors shadow-lg"
                >
                  <span className="material-symbols-outlined text-[16px] font-light">
                    {rep.estado === "inactivo" ? "check_circle" : "block"}
                  </span>
                </button>
              </div>

              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="font-['JetBrains_Mono'] text-[#D4AF6A] text-[12px] tracking-wider mb-1">
                    #{String(rep.id).slice(-6)}
                  </h3>
                </div>
                <span className={`px-2.5 py-1 border rounded-full text-[9px] uppercase tracking-widest font-['JetBrains_Mono'] flex items-center gap-1 ${getEstadoColor(rep.estado)}`}>
                  <span className="material-symbols-outlined text-[12px]">{getEstadoIcono(rep.estado)}</span>
                  {estadoLabel[rep.estado] || rep.estado}
                </span>
              </div>

              <div className="flex items-center gap-4 mb-5">
                <div className="w-12 h-12 rounded-full bg-[#1a1a1a] border border-[#D4AF6A]/20 flex items-center justify-center text-[#F2EDE4]/70 font-['Outfit'] text-[20px] shadow-inner">
                  {(rep.nombre || "?").charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-['Nunito'] text-[#F2EDE4] text-[16px] font-semibold">{rep.nombre}</p>
                  <p className="font-['JetBrains_Mono'] text-[#F2EDE4]/50 text-[10px] tracking-widest uppercase">{rep.vehiculo?.tipo}</p>
                </div>
              </div>

              <div className="pt-4 border-t border-[#D4AF6A]/10 flex justify-between items-end">
                <div className="flex flex-col gap-1">
                  <span className="font-['JetBrains_Mono'] text-[9px] uppercase tracking-[0.2em] text-[#D4AF6A]/50">Teléfono</span>
                  <span className="font-['JetBrains_Mono'] text-[12px] text-[#F2EDE4]/70">
                    {rep.telefono || "—"}
                  </span>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="font-['JetBrains_Mono'] text-[9px] uppercase tracking-[0.2em] text-[#D4AF6A]/50">Capacidad</span>
                  <span className="font-['JetBrains_Mono'] text-[12px] text-[#F2EDE4]/70">
                    {rep.capacidadOperativa} pedidos
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
        title={current ? "Editar Repartidor" : "Alta de Repartidor"}
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-[#D4AF6A]/70 font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.2em] mb-2">Nombre del Repartidor</label>
            <input
              type="text"
              name="nombre"
              defaultValue={current?.nombre || ""}
              required
              className="w-full bg-[#1a1a1a] border border-[#D4AF6A]/20 rounded-lg px-4 py-2.5 text-[#F2EDE4] font-['Nunito'] text-sm focus:outline-none focus:border-[#D4AF6A]/50 transition-colors"
              placeholder="Ej. Juan Rodríguez"
            />
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="block text-[#D4AF6A]/70 font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.2em] mb-2">Correo Electrónico</label>
              <input
                type="email"
                name="email"
                defaultValue={current?.email || ""}
                required
                className="w-full bg-[#1a1a1a] border border-[#D4AF6A]/20 rounded-lg px-4 py-2.5 text-[#F2EDE4] font-['Nunito'] text-sm focus:outline-none focus:border-[#D4AF6A]/50 transition-colors"
                placeholder="repartidor@correo.com"
              />
            </div>
            <div>
              <label className="block text-[#D4AF6A]/70 font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.2em] mb-2">Teléfono</label>
              <input
                type="tel"
                name="telefono"
                defaultValue={current?.telefono || ""}
                required
                className="w-full bg-[#1a1a1a] border border-[#D4AF6A]/20 rounded-lg px-4 py-2.5 text-[#F2EDE4] font-['Nunito'] text-sm focus:outline-none focus:border-[#D4AF6A]/50 transition-colors"
                placeholder="9511112222"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="block text-[#D4AF6A]/70 font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.2em] mb-2">Vehículo</label>
              <select
                name="vehiculoTipo"
                defaultValue={current?.vehiculo?.tipo || "motocicleta"}
                className="w-full bg-[#1a1a1a] border border-[#D4AF6A]/20 rounded-lg px-4 py-2.5 text-[#F2EDE4] font-['Nunito'] text-sm focus:outline-none focus:border-[#D4AF6A]/50 transition-colors appearance-none capitalize"
              >
                {VEHICULOS.map((v) => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[#D4AF6A]/70 font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.2em] mb-2">Placa</label>
              <input
                type="text"
                name="placa"
                defaultValue={current?.vehiculo?.placa || ""}
                className="w-full bg-[#1a1a1a] border border-[#D4AF6A]/20 rounded-lg px-4 py-2.5 text-[#F2EDE4] font-['Nunito'] text-sm focus:outline-none focus:border-[#D4AF6A]/50 transition-colors"
                placeholder="MX-12345"
              />
            </div>
          </div>

          {current && (
            <div>
              <label className="block text-[#D4AF6A]/70 font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.2em] mb-2">Estado</label>
              <select
                name="estado"
                defaultValue={current?.estado || "disponible"}
                className="w-full bg-[#1a1a1a] border border-[#D4AF6A]/20 rounded-lg px-4 py-2.5 text-[#F2EDE4] font-['Nunito'] text-sm focus:outline-none focus:border-[#D4AF6A]/50 transition-colors appearance-none"
              >
                <option value="disponible">Disponible</option>
                <option value="en_ruta">En Ruta</option>
                <option value="inactivo">Fuera de Servicio</option>
              </select>
            </div>
          )}

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
              {current ? "Guardar Cambios" : "Dar de Alta"}
            </button>
          </div>
        </form>
      </AdminModal>
    </div>
  );
}
export default AdminRepartidores;
