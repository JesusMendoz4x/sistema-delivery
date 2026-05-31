import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function AdminLogin() {
  const { iniciarSesion } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setCargando(true);
    const res = await iniciarSesion(email, password);
    setCargando(false);

    if (!res.ok) {
      setError(res.error || "Credenciales incorrectas.");
      return;
    }
    // Solo el rol admin puede entrar al panel de control.
    if (res.rol !== "admin") {
      setError("Esta cuenta no tiene permisos de administrador.");
      return;
    }
    navigate("/admin");
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center font-['Nunito'] relative overflow-hidden"
      style={{ backgroundColor: "rgb(10,10,10)" }}
    >
      {/* Background Ellipse */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] max-w-[1200px] aspect-square rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle at 50% 50%, rgba(140, 0, 0, 0.4) 0%, rgba(95, 0, 0, 0.2) 30%, rgba(30, 0, 0, 0.1) 50%, rgba(10, 10, 10, 0) 70%)",
          filter: "blur(60px)",
          zIndex: 0
        }}
      />

      <div className="bg-[#141414]/80 border border-[#D4AF6A]/20 p-12 rounded-2xl w-full max-w-md relative z-10 shadow-[0_15px_50px_rgba(0,0,0,0.6)] backdrop-blur-xl">
        <div className="text-center mb-10">
          <h1 className="text-[20px] font-['Outfit'] text-[#D4AF6A] tracking-[0.3em] uppercase mb-2">Casablanca</h1>
          <p className="text-[#F2EDE4]/50 font-['JetBrains_Mono'] text-[11px] tracking-widest uppercase">Panel de Acceso</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-[#D4AF6A]/70 font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.2em] mb-2">Correo Electrónico</label>
            <input 
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#1a1a1a] border border-[#D4AF6A]/20 rounded-lg px-4 py-3 text-[#F2EDE4] font-['Nunito'] text-sm focus:outline-none focus:border-[#D4AF6A]/50 transition-colors"
              placeholder="admin@delivery.com"
            />
          </div>
          
          <div>
            <label className="block text-[#D4AF6A]/70 font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.2em] mb-2">Contraseña</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#1a1a1a] border border-[#D4AF6A]/20 rounded-lg px-4 py-3 text-[#F2EDE4] font-['Nunito'] text-sm focus:outline-none focus:border-[#D4AF6A]/50 transition-colors"
              placeholder="••••••••"
            />
          </div>

          {error && <p className="text-[#9B2335] text-xs font-['Nunito']">{error}</p>}

          <button
            type="submit"
            disabled={cargando}
            className="w-full bg-[#9B2335] text-white py-3 rounded-lg font-['Nunito'] text-[14px] font-bold tracking-wide hover:opacity-90 transition-opacity shadow-[0_4px_14px_rgba(155,35,53,0.4)] mt-4 disabled:opacity-60 disabled:cursor-wait"
          >
            {cargando ? "Verificando..." : "Ingresar al Sistema"}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button onClick={() => navigate("/")} className="text-[#F2EDE4]/40 hover:text-[#D4AF6A] font-['JetBrains_Mono'] text-[10px] uppercase tracking-widest transition-colors">
            ← Volver al sitio principal
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
