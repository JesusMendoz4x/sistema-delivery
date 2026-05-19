function MenuCard({ nombre, descripcion, precio, imagen, badge, onAgregar }) {
  return (
    <div
      className="group relative flex flex-col items-center p-7 transition-all duration-300"
      style={{
        background: "#1a1a1a",
        border: "1px solid rgba(212, 175, 106, 0.2)",
        borderRadius: "12px",
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.borderColor = "rgba(212, 175, 106, 0.5)")
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.borderColor = "rgba(212, 175, 106, 0.2)")
      }
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

      {/* Imagen circular */}
      <div
        className="mb-5 overflow-hidden flex-shrink-0"
        style={{
          width: "160px",
          height: "160px",
          borderRadius: "50%",
          border: "2px solid rgba(212, 175, 106, 0.3)",
        }}
      >
        <img
          src={imagen}
          alt={nombre}
          className="w-full h-full object-cover transition-all duration-500 grayscale-[0.2] group-hover:grayscale-0 group-hover:scale-105"
        />
      </div>

      {/* Info */}
      <div className="flex flex-col items-center w-full flex-grow">
        <h3
          className="font-['EB_Garamond'] text-[18px] text-center mb-2"
          style={{ color: "#F2EDE4", fontWeight: 400 }}
        >
          {nombre}
        </h3>
        <p
          className="font-['DM_Sans'] text-[12px] text-center leading-relaxed line-clamp-2 mb-4"
          style={{ color: "rgba(242, 237, 228, 0.45)" }}
        >
          {descripcion}
        </p>

        {/* Footer */}
        <div
          className="flex justify-between items-center w-full mt-auto pt-4"
          style={{ borderTop: "1px solid rgba(212, 175, 106, 0.1)" }}
        >
          <span
            className="font-['JetBrains_Mono'] text-[14px]"
            style={{ color: "#D4AF6A" }}
          >
            ${precio}
          </span>
          <button
            onClick={onAgregar}
            className="font-['JetBrains_Mono'] text-[10px] uppercase tracking-widest px-4 py-2 transition-colors duration-200 active:scale-95"
            style={{ background: "#9B2335", color: "#F2EDE4", border: "none" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#7a1c1c")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#9B2335")}
          >
            Agregar
          </button>
        </div>
      </div>
    </div>
  );
}

export default MenuCard;
