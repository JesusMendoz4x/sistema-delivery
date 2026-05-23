import { useAuth } from "../context/AuthContext";

function MenuCard({ nombre, descripcion, precio, imagen, badge, onAgregar }) {
  const { isLoggedIn, openLoginModal } = useAuth();

  const handleAgregar = () => {
    if (!isLoggedIn) {
      openLoginModal();
      return;
    }
    onAgregar();
  };

  return (
    <div
      className="bg-surface-container p-4 hover:bg-surface-container-high transition-all duration-300 group"
      style={{ border: "1px solid rgba(212, 175, 106, 0.25)" }}
    >
      {/* Imagen */}
      <div className="relative overflow-hidden mb-4">
        <img
          src={imagen}
          alt={nombre}
          className="w-[180px] h-[180px] mx-auto object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all duration-500"
        />
        {badge && (
          <div className="absolute top-2 right-2">
            <div className="bg-secondary text-on-background px-2 py-1 font-['JetBrains_Mono'] text-[10px] uppercase">
              {badge}
            </div>
          </div>
        )}
      </div>

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
