function MenuCard({ nombre, descripcion, precio, imagen, badge, onAgregar }) {
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
            className="font-['EB_Garamond'] text-[18px] text-center mb-2 line-clamp-1 min-h-[24px]"
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
              style={{
                background: "#9B2335",
                color: "#F2EDE4",
                border: "none",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#7a1c1c")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "#9B2335")
              }
            >
              Agregar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MenuCard;
