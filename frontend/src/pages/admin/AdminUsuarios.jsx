import { useState } from "react";
import AdminModal from "../../components/AdminModal";

function AdminUsuarios() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const usuarios = [
    { id: 1, nombre: "Juan Pérez", email: "juan@casablanca.com", rol: "ADMIN", estado: "Activo" },
    { id: 2, nombre: "María López", email: "maria@ejemplo.com", rol: "CLIENTE", estado: "Activo" },
    { id: 3, nombre: "Carlos García", email: "carlos@ejemplo.com", rol: "CLIENTE", estado: "Inactivo" },
    { id: 4, nombre: "Ana Martínez", email: "ana@casablanca.com", rol: "ADMIN", estado: "Activo" },
    { id: 5, nombre: "Luis Torres", email: "luis@ejemplo.com", rol: "CLIENTE", estado: "Activo" },
    { id: 6, nombre: "Sofía Ruiz", email: "sofia@ejemplo.com", rol: "CLIENTE", estado: "Inactivo" },
  ];

  const handleAdd = () => {
    setCurrentUser(null);
    setIsModalOpen(true);
  };

  const handleEdit = (user) => {
    setCurrentUser(user);
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
          Gestión de Equipo
        </h2>
        <button 
          onClick={handleAdd}
          className="flex items-center gap-2 bg-[#9B2335] text-white px-6 py-2.5 rounded hover:opacity-80 transition-opacity shadow-[0_4px_14px_rgba(155,35,53,0.4)]"
        >
          <span className="material-symbols-outlined font-light text-[18px]">person_add</span>
          <span className="font-['Nunito'] text-[13px] font-bold tracking-wide">Nuevo Usuario</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {usuarios.map((user) => (
          <div key={user.id} className="bg-[#141414]/60 border border-[#D4AF6A]/20 p-6 rounded-xl relative group hover:border-[#D4AF6A]/50 hover:-translate-y-1 transition-all duration-300 shadow-[0_8px_30px_rgba(0,0,0,0.4)] backdrop-blur-md">
            
            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                onClick={() => handleEdit(user)}
                className="w-8 h-8 rounded-full bg-[#1a1a1a] border border-[#D4AF6A]/30 flex items-center justify-center text-[#D4AF6A]/70 hover:text-[#D4AF6A] hover:bg-[#D4AF6A]/10 transition-colors shadow-lg"
              >
                <span className="material-symbols-outlined text-[16px] font-light">edit</span>
              </button>
              <button className="w-8 h-8 rounded-full bg-[#1a1a1a] border border-[#9B2335]/30 flex items-center justify-center text-[#9B2335]/70 hover:text-[#9B2335] hover:bg-[#9B2335]/10 transition-colors shadow-lg">
                <span className="material-symbols-outlined text-[16px] font-light">delete</span>
              </button>
            </div>

            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-full bg-[#1a1a1a] border border-[#D4AF6A]/30 flex items-center justify-center text-[#D4AF6A] font-['Outfit'] text-[20px] font-light shadow-inner">
                {user.nombre.charAt(0)}
              </div>
              <div>
                <h3 className="font-['Nunito'] text-[#F2EDE4] text-[16px] font-semibold">{user.nombre}</h3>
                <p className="font-['Nunito'] text-[#F2EDE4]/50 text-[12px]">{user.email}</p>
              </div>
            </div>

            <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#D4AF6A]/10">
              <div className="flex flex-col gap-1">
                <span className="font-['JetBrains_Mono'] text-[9px] uppercase tracking-[0.2em] text-[#D4AF6A]/50">Rol</span>
                <span className={`font-['JetBrains_Mono'] text-[11px] tracking-wider ${user.rol === 'ADMIN' ? 'text-[#D4AF6A] font-bold' : 'text-[#F2EDE4]/70'}`}>
                  {user.rol}
                </span>
              </div>
              <div className="flex flex-col gap-1 items-end">
                <span className="font-['JetBrains_Mono'] text-[9px] uppercase tracking-[0.2em] text-[#D4AF6A]/50">Estado</span>
                <span className={`px-2 py-0.5 border rounded-full text-[9px] uppercase tracking-widest font-['JetBrains_Mono'] ${
                  user.estado === 'Activo' 
                  ? 'bg-[#D4AF6A]/10 border-[#D4AF6A]/30 text-[#D4AF6A]' 
                  : 'bg-[#F2EDE4]/5 border-[#F2EDE4]/20 text-[#F2EDE4]/50'
                }`}>
                  {user.estado}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <AdminModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={currentUser ? "Editar Usuario" : "Nuevo Usuario"}
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-[#D4AF6A]/70 font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.2em] mb-2">Nombre Completo</label>
            <input 
              type="text" 
              defaultValue={currentUser?.nombre || ""} 
              required 
              className="w-full bg-[#1a1a1a] border border-[#D4AF6A]/20 rounded-lg px-4 py-2.5 text-[#F2EDE4] font-['Nunito'] text-sm focus:outline-none focus:border-[#D4AF6A]/50 transition-colors" 
              placeholder="Ej. Ana Martínez"
            />
          </div>
          
          <div>
            <label className="block text-[#D4AF6A]/70 font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.2em] mb-2">Correo Electrónico</label>
            <input 
              type="email" 
              defaultValue={currentUser?.email || ""} 
              required 
              className="w-full bg-[#1a1a1a] border border-[#D4AF6A]/20 rounded-lg px-4 py-2.5 text-[#F2EDE4] font-['Nunito'] text-sm focus:outline-none focus:border-[#D4AF6A]/50 transition-colors" 
              placeholder="correo@ejemplo.com"
            />
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="block text-[#D4AF6A]/70 font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.2em] mb-2">Rol del Sistema</label>
              <select 
                defaultValue={currentUser?.rol || "CLIENTE"} 
                className="w-full bg-[#1a1a1a] border border-[#D4AF6A]/20 rounded-lg px-4 py-2.5 text-[#F2EDE4] font-['Nunito'] text-sm focus:outline-none focus:border-[#D4AF6A]/50 transition-colors appearance-none"
              >
                <option value="CLIENTE">Cliente</option>
                <option value="ADMIN">Administrador</option>
                <option value="REPARTIDOR">Repartidor</option>
              </select>
            </div>
            <div>
              <label className="block text-[#D4AF6A]/70 font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.2em] mb-2">Estado</label>
              <select 
                defaultValue={currentUser?.estado || "Activo"} 
                className="w-full bg-[#1a1a1a] border border-[#D4AF6A]/20 rounded-lg px-4 py-2.5 text-[#F2EDE4] font-['Nunito'] text-sm focus:outline-none focus:border-[#D4AF6A]/50 transition-colors appearance-none"
              >
                <option value="Activo">Activo</option>
                <option value="Inactivo">Inactivo (Suspendido)</option>
              </select>
            </div>
          </div>

          {!currentUser && (
            <div>
              <label className="block text-[#D4AF6A]/70 font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.2em] mb-2">Contraseña Temporal</label>
              <input 
                type="password" 
                required 
                className="w-full bg-[#1a1a1a] border border-[#D4AF6A]/20 rounded-lg px-4 py-2.5 text-[#F2EDE4] font-['Nunito'] text-sm focus:outline-none focus:border-[#D4AF6A]/50 transition-colors" 
                placeholder="Mínimo 8 caracteres"
              />
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
              {currentUser ? "Guardar Cambios" : "Crear Usuario"}
            </button>
          </div>
        </form>
      </AdminModal>
    </div>
  );
}
export default AdminUsuarios;
