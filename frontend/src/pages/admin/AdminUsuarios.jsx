import { useState, useEffect } from "react";
import AdminModal from "../../components/AdminModal";
import {
  getUsuarios,
  createUsuario,
  updateUsuario,
  activarUsuario,
  desactivarUsuario,
} from "../../services/usuariosService";

const ROLES = [
  { value: "cliente", label: "Cliente" },
  { value: "admin", label: "Administrador" },
  { value: "sucursal", label: "Sucursal" },
];

function AdminUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchUsuarios = async () => {
    try {
      const data = await getUsuarios();
      setUsuarios(data);
      setError("");
    } catch (err) {
      console.error("Error al cargar usuarios", err);
      setError("No se pudieron cargar los usuarios (¿sesión de admin activa?).");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const handleAdd = () => {
    setCurrentUser(null);
    setIsModalOpen(true);
  };

  const handleEdit = (user) => {
    setCurrentUser(user);
    setIsModalOpen(true);
  };

  const toggleEstado = async (user) => {
    try {
      if (user.estado === "activo") {
        await desactivarUsuario(user.id);
      } else {
        await activarUsuario(user.id);
      }
      await fetchUsuarios();
    } catch (err) {
      console.error("Error al cambiar estado", err);
      window.alert("No se pudo cambiar el estado del usuario.");
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
      rol: data.rol,
    };

    try {
      if (currentUser) {
        // En edición la contraseña es opcional; solo se envía si se escribió.
        if (data.password) payload.password = data.password;
        payload.estado = data.estado;
        await updateUsuario(currentUser.id, payload);
      } else {
        payload.password = data.password;
        await createUsuario(payload);
      }
      setIsModalOpen(false);
      await fetchUsuarios();
    } catch (err) {
      console.error("Error al guardar usuario", err);
      window.alert(
        err.response?.data?.message || "No se pudo guardar el usuario.",
      );
    }
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

      {error && (
        <div className="mb-6 text-[#E57474] font-['JetBrains_Mono'] text-[12px] uppercase tracking-widest">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="text-center text-[#D4AF6A] font-['JetBrains_Mono'] mt-20">Cargando usuarios...</div>
      ) : usuarios.length === 0 ? (
        <div className="text-center text-[#F2EDE4]/40 font-['Nunito'] mt-20">No hay usuarios registrados.</div>
      ) : (
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
                <button
                  onClick={() => toggleEstado(user)}
                  title={user.estado === "activo" ? "Desactivar" : "Activar"}
                  className="w-8 h-8 rounded-full bg-[#1a1a1a] border border-[#9B2335]/30 flex items-center justify-center text-[#9B2335]/70 hover:text-[#9B2335] hover:bg-[#9B2335]/10 transition-colors shadow-lg"
                >
                  <span className="material-symbols-outlined text-[16px] font-light">
                    {user.estado === "activo" ? "block" : "check_circle"}
                  </span>
                </button>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-full bg-[#1a1a1a] border border-[#D4AF6A]/30 flex items-center justify-center text-[#D4AF6A] font-['Outfit'] text-[20px] font-light shadow-inner">
                  {(user.nombre || "?").charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-['Nunito'] text-[#F2EDE4] text-[16px] font-semibold">{user.nombre}</h3>
                  <p className="font-['Nunito'] text-[#F2EDE4]/50 text-[12px]">{user.email}</p>
                </div>
              </div>

              <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#D4AF6A]/10">
                <div className="flex flex-col gap-1">
                  <span className="font-['JetBrains_Mono'] text-[9px] uppercase tracking-[0.2em] text-[#D4AF6A]/50">Rol</span>
                  <span className={`font-['JetBrains_Mono'] text-[11px] tracking-wider uppercase ${user.rol === "admin" ? "text-[#D4AF6A] font-bold" : "text-[#F2EDE4]/70"}`}>
                    {user.rol}
                  </span>
                </div>
                <div className="flex flex-col gap-1 items-end">
                  <span className="font-['JetBrains_Mono'] text-[9px] uppercase tracking-[0.2em] text-[#D4AF6A]/50">Estado</span>
                  <span className={`px-2 py-0.5 border rounded-full text-[9px] uppercase tracking-widest font-['JetBrains_Mono'] ${
                    user.estado === "activo"
                      ? "bg-[#D4AF6A]/10 border-[#D4AF6A]/30 text-[#D4AF6A]"
                      : "bg-[#F2EDE4]/5 border-[#F2EDE4]/20 text-[#F2EDE4]/50"
                  }`}>
                    {user.estado}
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
        title={currentUser ? "Editar Usuario" : "Nuevo Usuario"}
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-[#D4AF6A]/70 font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.2em] mb-2">Nombre Completo</label>
            <input
              type="text"
              name="nombre"
              defaultValue={currentUser?.nombre || ""}
              required
              className="w-full bg-[#1a1a1a] border border-[#D4AF6A]/20 rounded-lg px-4 py-2.5 text-[#F2EDE4] font-['Nunito'] text-sm focus:outline-none focus:border-[#D4AF6A]/50 transition-colors"
              placeholder="Ej. Ana Martínez"
            />
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="block text-[#D4AF6A]/70 font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.2em] mb-2">Correo Electrónico</label>
              <input
                type="email"
                name="email"
                defaultValue={currentUser?.email || ""}
                required
                className="w-full bg-[#1a1a1a] border border-[#D4AF6A]/20 rounded-lg px-4 py-2.5 text-[#F2EDE4] font-['Nunito'] text-sm focus:outline-none focus:border-[#D4AF6A]/50 transition-colors"
                placeholder="correo@ejemplo.com"
              />
            </div>
            <div>
              <label className="block text-[#D4AF6A]/70 font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.2em] mb-2">Teléfono</label>
              <input
                type="tel"
                name="telefono"
                defaultValue={currentUser?.telefono || ""}
                required
                className="w-full bg-[#1a1a1a] border border-[#D4AF6A]/20 rounded-lg px-4 py-2.5 text-[#F2EDE4] font-['Nunito'] text-sm focus:outline-none focus:border-[#D4AF6A]/50 transition-colors"
                placeholder="9511234567"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="block text-[#D4AF6A]/70 font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.2em] mb-2">Rol del Sistema</label>
              <select
                name="rol"
                defaultValue={currentUser?.rol || "cliente"}
                className="w-full bg-[#1a1a1a] border border-[#D4AF6A]/20 rounded-lg px-4 py-2.5 text-[#F2EDE4] font-['Nunito'] text-sm focus:outline-none focus:border-[#D4AF6A]/50 transition-colors appearance-none"
              >
                {ROLES.map((r) => (
                  <option key={r.value} value={r.value}>{r.label}</option>
                ))}
              </select>
            </div>
            {currentUser && (
              <div>
                <label className="block text-[#D4AF6A]/70 font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.2em] mb-2">Estado</label>
                <select
                  name="estado"
                  defaultValue={currentUser?.estado || "activo"}
                  className="w-full bg-[#1a1a1a] border border-[#D4AF6A]/20 rounded-lg px-4 py-2.5 text-[#F2EDE4] font-['Nunito'] text-sm focus:outline-none focus:border-[#D4AF6A]/50 transition-colors appearance-none"
                >
                  <option value="activo">Activo</option>
                  <option value="inactivo">Inactivo (Suspendido)</option>
                </select>
              </div>
            )}
          </div>

          <div>
            <label className="block text-[#D4AF6A]/70 font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.2em] mb-2">
              {currentUser ? "Nueva Contraseña (opcional)" : "Contraseña"}
            </label>
            <input
              type="password"
              name="password"
              required={!currentUser}
              minLength={6}
              className="w-full bg-[#1a1a1a] border border-[#D4AF6A]/20 rounded-lg px-4 py-2.5 text-[#F2EDE4] font-['Nunito'] text-sm focus:outline-none focus:border-[#D4AF6A]/50 transition-colors"
              placeholder="Mínimo 6 caracteres"
            />
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
              {currentUser ? "Guardar Cambios" : "Crear Usuario"}
            </button>
          </div>
        </form>
      </AdminModal>
    </div>
  );
}
export default AdminUsuarios;
