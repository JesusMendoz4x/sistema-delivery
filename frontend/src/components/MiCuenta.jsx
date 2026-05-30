import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

function MiCuenta() {
  const { user, logout, actualizarUserData } = useAuth();
  const [nombre, setNombre] = useState(user?.nombre || "");
  const [email, setEmail] = useState(user?.email || "");
  const [telefono, setTelefono] = useState(user?.telefono || "");
  const [direccion, setDireccion] = useState(user?.direccion || "");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState({ tipo: "", texto: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nombre.trim() || !email.trim() || !telefono.trim()) {
      setMensaje({ tipo: "error", texto: "Por favor, completa todos los campos obligatorios." });
      return;
    }

    setIsSubmitting(true);
    setMensaje({ tipo: "", texto: "" });

    const payload = {
      nombre,
      email,
      telefono,
      direccion,
    };

    if (password.trim()) {
      if (password.length < 6) {
        setMensaje({ tipo: "error", texto: "La contraseña debe tener al menos 6 caracteres." });
        setIsSubmitting(false);
        return;
      }
      payload.password = password;
    }

    try {
      const userId = user._id || user.id;
      const response = await api.put(`/usuarios/${userId}`, payload);
      
      // Actualizar el contexto de autenticación local con los nuevos datos
      actualizarUserData(response.data);
      setMensaje({ tipo: "exito", texto: "¡Tus datos han sido actualizados correctamente!" });
      setPassword(""); // Limpiar campo de contraseña
    } catch (error) {
      console.error("Error al actualizar perfil:", error);
      setMensaje({
        tipo: "error",
        texto: error.response?.data?.message || "Ocurrió un error al actualizar tus datos.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto pt-28 pb-16 px-6 font-['Nunito'] relative z-10">
      <div className="bg-[#141414]/80 border border-[#D4AF6A]/20 p-8 sm:p-10 rounded-2xl shadow-[0_15px_40px_rgba(0,0,0,0.6)] backdrop-blur-md">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-6 pb-6 border-b border-[#D4AF6A]/10 mb-8">
          <div>
            <h2 className="text-[26px] font-['Outfit'] text-[#F2EDE4] tracking-wider uppercase mb-1">
              Mi Cuenta
            </h2>
            <p className="text-[12px] text-[#D4AF6A] font-['JetBrains_Mono'] uppercase tracking-widest">
              Gestiona tu información de perfil y entrega
            </p>
          </div>
          
          <button
            onClick={logout}
            className="flex items-center justify-center gap-2 border border-[#9B2335]/40 bg-[#9B2335]/15 hover:bg-[#9B2335] text-[#ffcccc] hover:text-white px-5 py-2 rounded-lg font-['JetBrains_Mono'] text-[11px] uppercase tracking-widest transition-all duration-300 shadow-[0_4px_12px_rgba(155,35,53,0.15)] active:scale-[0.98]"
          >
            <span className="material-symbols-outlined text-[16px] font-light">logout</span>
            Cerrar Sesión
          </button>
        </div>

        {/* Alertas */}
        {mensaje.texto && (
          <div className={`p-4 rounded-lg mb-6 border text-sm font-light ${
            mensaje.tipo === "exito" 
              ? "bg-green-500/10 border-green-500/30 text-green-400" 
              : "bg-red-500/10 border-red-500/30 text-red-400"
          }`}>
            {mensaje.texto}
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-[#D4AF6A]/80 font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.2em] mb-2">Nombre Completo *</label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
                className="w-full bg-[#1a1a1a] border border-[#D4AF6A]/20 rounded-lg px-4 py-2.5 text-[#F2EDE4] font-['Nunito'] text-sm focus:outline-none focus:border-[#D4AF6A]/50 transition-colors"
                placeholder="Tu nombre completo"
              />
            </div>
            
            <div>
              <label className="block text-[#D4AF6A]/80 font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.2em] mb-2">Teléfono *</label>
              <input
                type="tel"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                required
                className="w-full bg-[#1a1a1a] border border-[#D4AF6A]/20 rounded-lg px-4 py-2.5 text-[#F2EDE4] font-['Nunito'] text-sm focus:outline-none focus:border-[#D4AF6A]/50 transition-colors"
                placeholder="Ej. 9511234567"
              />
            </div>
          </div>

          <div>
            <label className="block text-[#D4AF6A]/80 font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.2em] mb-2">Correo Electrónico *</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-[#1a1a1a] border border-[#D4AF6A]/20 rounded-lg px-4 py-2.5 text-[#F2EDE4] font-['Nunito'] text-sm focus:outline-none focus:border-[#D4AF6A]/50 transition-colors"
              placeholder="correo@ejemplo.com"
            />
          </div>

          <div>
            <label className="block text-[#D4AF6A]/80 font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.2em] mb-2">Dirección de Entrega Frecuente</label>
            <textarea
              value={direccion}
              onChange={(e) => setDireccion(e.target.value)}
              rows={2}
              className="w-full bg-[#1a1a1a] border border-[#D4AF6A]/20 rounded-lg px-4 py-2.5 text-[#F2EDE4] font-['Nunito'] text-sm focus:outline-none focus:border-[#D4AF6A]/50 transition-colors resize-none"
              placeholder="Calle, número, colonia, código postal y referencias"
            />
            <p className="text-[10px] text-[#F2EDE4]/30 mt-1.5 leading-relaxed">
              * Guardar tu dirección aquí rellenará automáticamente los datos de entrega de tus nuevos pedidos.
            </p>
          </div>

          <div className="pt-4 border-t border-[#D4AF6A]/10">
            <label className="block text-[#D4AF6A]/80 font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.2em] mb-2">Cambiar Contraseña (Opcional)</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#1a1a1a] border border-[#D4AF6A]/20 rounded-lg px-4 py-2.5 text-[#F2EDE4] font-['Nunito'] text-sm focus:outline-none focus:border-[#D4AF6A]/50 transition-colors"
              placeholder="Escribe una nueva contraseña si deseas cambiarla"
            />
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#D4AF6A] text-[#101010] px-8 py-3 rounded-lg font-['Nunito'] text-[13px] font-bold hover:opacity-90 disabled:opacity-50 transition-opacity shadow-[0_4px_14px_rgba(212,175,106,0.3)] active:scale-[0.98]"
            >
              {isSubmitting ? "Guardando..." : "Guardar Cambios"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default MiCuenta;
