import { useState } from "react";
import AdminModal from "../../components/AdminModal";

function AdminRepartidores() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentRepartidor, setCurrentRepartidor] = useState(null);

  const repartidores = [
    { id: "REP-01", nombre: "Juan Rodríguez", vehiculo: "Motocicleta", estado: "Disponible", ordenActual: null, viajes: 142 },
    { id: "REP-02", nombre: "Pedro Morales", vehiculo: "Bicicleta", estado: "En Ruta", ordenActual: "ORD-004", viajes: 89 },
    { id: "REP-03", nombre: "Luis Fernández", vehiculo: "Motocicleta", estado: "Disponible", ordenActual: null, viajes: 210 },
    { id: "REP-04", nombre: "Carlos Santidad", vehiculo: "Auto", estado: "Fuera de Servicio", ordenActual: null, viajes: 56 },
  ];

  const getEstadoColor = (estado) => {
    switch (estado) {
      case "Disponible": return "text-[#D4AF6A] bg-[#D4AF6A]/10 border-[#D4AF6A]/30";
      case "En Ruta": return "text-blue-400 bg-blue-500/10 border-blue-500/30";
      case "Fuera de Servicio": return "text-[#F2EDE4]/50 bg-[#F2EDE4]/5 border-[#F2EDE4]/20";
      default: return "";
    }
  };

  const getEstadoIcono = (estado) => {
    switch (estado) {
      case "Disponible": return "check_circle";
      case "En Ruta": return "two_wheeler";
      case "Fuera de Servicio": return "block";
      default: return "person";
    }
  };

  const handleEdit = (repartidor) => {
    setCurrentRepartidor(repartidor);
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsModalOpen(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-[24px] font-['Outfit'] text-[#F2EDE4] tracking-widest uppercase">
          Logística y Flotilla
        </h2>
        <button 
          onClick={() => { setCurrentRepartidor(null); setIsModalOpen(true); }}
          className="flex items-center gap-2 bg-[#9B2335] text-white px-6 py-2.5 rounded hover:opacity-80 transition-opacity shadow-[0_4px_14px_rgba(155,35,53,0.4)]"
        >
          <span className="material-symbols-outlined font-light text-[18px]">person_add</span>
          <span className="font-['Nunito'] text-[13px] font-bold tracking-wide">Alta de Repartidor</span>
        </button>
      </div>

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
            </div>

            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="font-['JetBrains_Mono'] text-[#D4AF6A] text-[13px] tracking-wider mb-1">
                  {rep.id}
                </h3>
              </div>
              <span className={`px-2.5 py-1 border rounded-full text-[9px] uppercase tracking-widest font-['JetBrains_Mono'] flex items-center gap-1 ${getEstadoColor(rep.estado)}`}>
                <span className="material-symbols-outlined text-[12px]">{getEstadoIcono(rep.estado)}</span>
                {rep.estado}
              </span>
            </div>

            <div className="flex items-center gap-4 mb-5">
              <div className="w-12 h-12 rounded-full bg-[#1a1a1a] border border-[#D4AF6A]/20 flex items-center justify-center text-[#F2EDE4]/70 font-['Outfit'] text-[20px] shadow-inner">
                {rep.nombre.charAt(0)}
              </div>
              <div>
                <p className="font-['Nunito'] text-[#F2EDE4] text-[16px] font-semibold">{rep.nombre}</p>
                <p className="font-['JetBrains_Mono'] text-[#F2EDE4]/50 text-[10px] tracking-widest uppercase">{rep.vehiculo}</p>
              </div>
            </div>

            <div className="pt-4 border-t border-[#D4AF6A]/10 flex justify-between items-end">
              <div className="flex flex-col gap-1">
                <span className="font-['JetBrains_Mono'] text-[9px] uppercase tracking-[0.2em] text-[#D4AF6A]/50">Entregas Totales</span>
                <span className="font-['JetBrains_Mono'] text-[12px] text-[#F2EDE4]/70">
                  {rep.viajes} viajes
                </span>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="font-['JetBrains_Mono'] text-[9px] uppercase tracking-[0.2em] text-[#D4AF6A]/50">Orden Actual</span>
                <span className={`font-['JetBrains_Mono'] text-[12px] font-bold ${rep.ordenActual ? 'text-blue-400' : 'text-[#F2EDE4]/30'}`}>
                  {rep.ordenActual || "Ninguna"}
                </span>
              </div>
            </div>

          </div>
        ))}
      </div>

      <AdminModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={currentRepartidor ? "Editar Repartidor" : "Alta de Repartidor"}
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-[#D4AF6A]/70 font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.2em] mb-2">Nombre del Repartidor</label>
            <input 
              type="text" 
              defaultValue={currentRepartidor?.nombre || ""} 
              required 
              className="w-full bg-[#1a1a1a] border border-[#D4AF6A]/20 rounded-lg px-4 py-2.5 text-[#F2EDE4] font-['Nunito'] text-sm focus:outline-none focus:border-[#D4AF6A]/50 transition-colors" 
              placeholder="Ej. Juan Rodríguez"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="block text-[#D4AF6A]/70 font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.2em] mb-2">Vehículo</label>
              <select 
                defaultValue={currentRepartidor?.vehiculo || "Motocicleta"} 
                className="w-full bg-[#1a1a1a] border border-[#D4AF6A]/20 rounded-lg px-4 py-2.5 text-[#F2EDE4] font-['Nunito'] text-sm focus:outline-none focus:border-[#D4AF6A]/50 transition-colors appearance-none"
              >
                <option value="Motocicleta">Motocicleta</option>
                <option value="Bicicleta">Bicicleta</option>
                <option value="Auto">Automóvil</option>
              </select>
            </div>
            <div>
              <label className="block text-[#D4AF6A]/70 font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.2em] mb-2">Estado</label>
              <select 
                defaultValue={currentRepartidor?.estado || "Disponible"} 
                className="w-full bg-[#1a1a1a] border border-[#D4AF6A]/20 rounded-lg px-4 py-2.5 text-[#F2EDE4] font-['Nunito'] text-sm focus:outline-none focus:border-[#D4AF6A]/50 transition-colors appearance-none"
              >
                <option value="Disponible">Disponible</option>
                <option value="En Ruta">En Ruta</option>
                <option value="Fuera de Servicio">Fuera de Servicio</option>
              </select>
            </div>
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
              {currentRepartidor ? "Guardar Cambios" : "Dar de Alta"}
            </button>
          </div>
        </form>
      </AdminModal>
    </div>
  );
}
export default AdminRepartidores;
