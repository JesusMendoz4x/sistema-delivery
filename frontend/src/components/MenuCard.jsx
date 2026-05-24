import { useAuth } from "../context/AuthContext";

function MenuCard({ nombre, descripcion, precio, imagen, badge, onAgregar }) {
  const { isLoggedIn, openAuthWall } = useAuth();

  const handleAgregar = () => {
    if (!isLoggedIn) {
      openAuthWall("agregar");
      return;
    }
    onAgregar();
  };

  return (
    <div className="group relative z-10">
      <div
        className="absolute -inset-1 rounded-[16px] opacity-0 blur-[14px] transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(circle at 30% 20%, rgba(212, 175, 106, 0.25), rgba(155, 35, 53, 0.2) 45%, rgba(0, 0, 0, 0) 70%)",
        }}
      />
      <div
        className="relative flex flex-col items-center p-7 transition-all duration-300 group-hover:scale-[1.03]"
        style={{
          background: "#1a1a1a",
          border: "1px solid rgba(212, 175, 106, 0.2)",
          borderRadius: "12px",
          boxShadow: "0 0 0 rgba(0,0,0,0)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = "rgba(212, 175, 106, 0.6)";
          e.currentTarget.style.boxShadow =
            "0 12px 30px rgba(0,0,0,0.35), 0 0 20px rgba(212, 175, 106, 0.15)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "rgba(212, 175, 106, 0.2)";
          e.currentTarget.style.boxShadow = "0 0 0 rgba(0,0,0,0)";
        }}
      >
        {/* Badge */}
        {badge && (
          <div
            className="absolute top-3 right-3 font-['JetBrains_Mono'] text-[9px] uppercase tracking-widest px-2 py-1"
            style={{ background: "#D4AF6A", color: "#1a1a1a" }}
          >
            {badge}
          </div>
        )}

      {/* Info */}
      <div className="flex flex-col text-center">
        <h3 className="font-['EB_Garamond'] text-xl mb-1 text-on-background">
          {nombre}
        </h3>
        <p className="font-['DM_Sans'] text-sm text-on-surface-variant mb-4 line-clamp-2">
          {descripcion}
        </p>
        <div className="flex justify-between items-center mt-auto pt-4 border-t border-secondary/10">
          <span className="font-['JetBrains_Mono'] text-secondary font-bold">
            ${precio}
          </span>
          <button
            onClick={handleAgregar}
            className="bg-primary px-4 py-1.5 font-['JetBrains_Mono'] text-[10px] uppercase tracking-widest hover:bg-primary-container transition-colors active:scale-95 text-surface"
          >
            Agregar
          </button>
        </div>
      </div>
    </div>
  );
}

export default MenuCard;
