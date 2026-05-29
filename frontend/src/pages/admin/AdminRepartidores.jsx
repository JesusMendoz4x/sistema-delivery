import { useState, useEffect } from "react";
import AdminModal from "../../components/AdminModal";
import { getRepartidores, crearRepartidor, activarRepartidor } from "../../services/repartidoresService";

function AdminRepartidores() {
  const [repartidores, setRepartidores] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentRepartidor, setCurrentRepartidor] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchRepartidores = async () => {
    setIsLoading(true);
    try {
      const data = await getRepartidores();
      setRepartidores(data);
    } catch (error) {
      console.error("Error al obtener repartidores:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Avoid calling setState synchronously within the effect body
    // by deferring the call to the next macrotask.
    const t = setTimeout(() => {
      fetchRepartidores();
    }, 0);
    return () => clearTimeout(t);
  }, []);

  const getEstadoColor = (estado) => {
    switch (estado) {
      case "disponible": return "text-[#D4AF6A] bg-[#D4AF6A]/10 border-[#D4AF6A]/30";
      case "en_camino": return "text-blue-400 bg-blue-500/10 border-blue-500/30";
      case "inactivo": return "text-[#F2EDE4]/50 bg-[#F2EDE4]/5 border-[#F2EDE4]/20";
      default: return "";
    }
  };

  const getEstadoIcono = (estado) => {
    switch (estado) {
      case "disponible": return "check_circle";
      case "en_camino": return "two_wheeler";
      case "inactivo": return "block";
      default: return "person";
    }
  };

  const getEstadoDisplay = (estado) => {
    switch(estado) {
      case "disponible": return "Disponible";
      case "en_camino": return "En Ruta";
      case "inactivo": return "Inactivo";
      default: return estado;
    }
  };

  const handleEdit = (repartidor) => {
    setCurrentRepartidor(repartidor);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    try {
      if (currentRepartidor) {
        // Si ya existe, permitimos liberar su estado atómicamente a disponible
        if (data.estado === "disponible") {
          await activarRepartidor(currentRepartidor._id);
        }
      } else {
        // Creación real de nuevo repartidor en MongoDB
        await crearRepartidor({
          nombre: data.nombre,
          email: data.email,
          telefono: data.telefono,
          vehiculo: {
            tipo: data.vehiculoTipo.toLowerCase(),
            placa: data.placa || "MEX-000"
          },
          ubicacion: {
            latitud: 17.0600, // Coordenadas del Zócalo de Oaxaca
            longitud: -96.7260
          },
          capacidadOperativa: 3,
          estado: "disponible"
        });
      }
      setIsModalOpen(false);
      await fetchRepartidores();
    } catch (error) {
      console.error("Error al guardar repartidor:", error);
      alert("Hubo un error al dar de alta al repartidor en MongoDB.");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-[24px] font-['Outfit'] text-[#F2EDE4] tracking-widest uppercase">
          Logística y Flotilla de Reparto
        </h2>
        <button 
          onClick={() => { setCurrentRepartidor(null); setIsModalOpen(true); }}
          className="flex items-center gap-2 bg-[#9B2335] text-white px-6 py-2.5 rounded hover:opacity-80 transition-opacity shadow-[0_4px_14px_rgba(155,35,53,0.4)]"
        >
          <span className="material-symbols-outlined font-light text-[18px]">person_add</span>
          <span className="font-['Nunito'] text-[13px] font-bold tracking-wide">Alta de Repartidor</span>
        </button>
      </div>

      {isLoading ? (
        <div className="text-center text-[#D4AF6A] font-['JetBrains_Mono'] mt-20">
          Cargando flotilla física de base de datos...
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {repartidores.map((rep) => (
            <div key={rep._id} className="bg-[#141414]/60 border border-[#D4AF6A]/20 p-6 rounded-xl relative group hover:border-[#D4AF6A]/50 hover:-translate-y-1 transition-all duration-300 shadow-[0_8px_30px_rgba(0,0,0,0.4)] backdrop-blur-md">
              
              <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => handleEdit(rep)}
                  className="w-8 h-8 rounded-full bg-[#1a1a1a] border border-[#D4AF6A]/30 flex items-center justify-center text-[#D4AF6A]/70 hover:text-[#D4AF6A] hover:bg-[#D4AF6A]/10 transition-colors shadow-lg"
                >
                  <span className="material-symbols-outlined text-[16px] font-light">edit</span>
                </button>
              </div>

              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="font-['JetBrains_Mono'] text-[#D4AF6A] text-[13px] tracking-wider mb-1">
                    {`REP-${rep._id.slice(-4).toUpperCase()}`}
                  </h3>
                </div>
                <span className={`px-2.5 py-1 border rounded-full text-[9px] uppercase tracking-widest font-['JetBrains_Mono'] flex items-center gap-1 ${getEstadoColor(rep.estado)}`}>
                  <span className="material-symbols-outlined text-[12px]">{getEstadoIcono(rep.estado)}</span>
                  {getEstadoDisplay(rep.estado)}
                </span>
              </div>

              <div className="flex items-center gap-4 mb-5">
                <div className="w-12 h-12 rounded-full bg-[#1a1a1a] border border-[#D4AF6A]/20 flex items-center justify-center text-[#F2EDE4]/70 font-['Outfit'] text-[20px] shadow-inner">
                  {rep.nombre.charAt(0)}
                </div>
                <div>
                  <p className="font-['Nunito'] text-[#F2EDE4] text-[16px] font-semibold">{rep.nombre}</p>
                  <p className="font-['JetBrains_Mono'] text-[#F2EDE4]/50 text-[10px] tracking-widest uppercase">
                    {rep.vehiculo?.tipo || "Motocicleta"}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-[#D4AF6A]/10 flex justify-between items-end">
                <div className="flex flex-col gap-1">
                  <span className="font-['JetBrains_Mono'] text-[9px] uppercase tracking-[0.2em] text-[#D4AF6A]/50">Contacto</span>
                  <span className="font-['JetBrains_Mono'] text-[11px] text-[#F2EDE4]/70">
                    {rep.telefono}
                  </span>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="font-['JetBrains_Mono'] text-[9px] uppercase tracking-[0.2em] text-[#D4AF6A]/50">Capacidad</span>
                  <span className="font-['JetBrains_Mono'] text-[11px] text-[#D4AF6A]">
                    {rep.capacidadOperativa} orden(es)
                  </span>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Modal para dar de alta o editar repartidor */}
      <AdminModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={currentRepartidor ? "Editar Estatus Repartidor" : "Alta de Repartidor"}
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-[#D4AF6A]/70 font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.2em] mb-2">
              Nombre Completo
            </label>
            <input 
              type="text" 
              name="nombre"
              disabled={!!currentRepartidor}
              defaultValue={currentRepartidor?.nombre || ""} 
              required 
              className={`w-full bg-[#1a1a1a] border border-[#D4AF6A]/20 rounded-lg px-4 py-2.5 text-[#F2EDE4] font-['Nunito'] text-sm focus:outline-none focus:border-[#D4AF6A]/50 transition-colors ${currentRepartidor ? 'cursor-not-allowed opacity-60' : ''}`} 
              placeholder="Ej. Carlos Express"
            />
          </div>

          {!currentRepartidor && (
            <>
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-[#D4AF6A]/70 font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.2em] mb-2">
                    Correo Electrónico
                  </label>
                  <input 
                    type="email" 
                    name="email"
                    required 
                    className="w-full bg-[#1a1a1a] border border-[#D4AF6A]/20 rounded-lg px-4 py-2.5 text-[#F2EDE4] font-['Nunito'] text-sm focus:outline-none focus:border-[#D4AF6A]/50 transition-colors" 
                    placeholder="carlos@delivery.com"
                  />
                </div>
                <div>
                  <label className="block text-[#D4AF6A]/70 font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.2em] mb-2">
                    Teléfono Celular
                  </label>
                  <input 
                    type="tel" 
                    name="telefono"
                    required 
                    className="w-full bg-[#1a1a1a] border border-[#D4AF6A]/20 rounded-lg px-4 py-2.5 text-[#F2EDE4] font-['Nunito'] text-sm focus:outline-none focus:border-[#D4AF6A]/50 transition-colors" 
                    placeholder="951 123 4567"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-[#D4AF6A]/70 font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.2em] mb-2">
                    Tipo de Vehículo
                  </label>
                  <select 
                    name="vehiculoTipo"
                    className="w-full bg-[#1a1a1a] border border-[#D4AF6A]/20 rounded-lg px-4 py-2.5 text-[#F2EDE4] font-['Nunito'] text-sm focus:outline-none focus:border-[#D4AF6A]/50 transition-colors appearance-none"
                  >
                    <option value="Motocicleta">Motocicleta</option>
                    <option value="Bicicleta">Bicicleta</option>
                    <option value="Automóvil">Automóvil</option>
                    <option value="a pie">A pie</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[#D4AF6A]/70 font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.2em] mb-2">
                    Número de Placa
                  </label>
                  <input 
                    type="text" 
                    name="placa"
                    className="w-full bg-[#1a1a1a] border border-[#D4AF6A]/20 rounded-lg px-4 py-2.5 text-[#F2EDE4] font-['Nunito'] text-sm focus:outline-none focus:border-[#D4AF6A]/50 transition-colors" 
                    placeholder="Ej. OAX-772A"
                  />
                </div>
              </div>
            </>
          )}

          {currentRepartidor && (
            <div>
              <label className="block text-[#D4AF6A]/70 font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.2em] mb-2">
                Estado del Conductor
              </label>
              <select 
                name="estado"
                defaultValue={currentRepartidor.estado} 
                className="w-full bg-[#1a1a1a] border border-[#D4AF6A]/20 rounded-lg px-4 py-2.5 text-[#F2EDE4] font-['Nunito'] text-sm focus:outline-none focus:border-[#D4AF6A]/50 transition-colors appearance-none"
              >
                <option value="disponible">Disponible (Liberado)</option>
                <option value="en_camino">En ruta de entrega</option>
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
              {currentRepartidor ? "Guardar Cambios" : "Dar de Alta"}
            </button>
          </div>
        </form>
      </AdminModal>
    </div>
  );
}

export default AdminRepartidores;
