import { useAuth } from "../context/AuthContext";

function MenuCard({
  nombre,
  descripcion,
  precio,
  imagen,
  badge,
  onAgregar,
  onOpen,
  variant = "gold",
}) {
  const { isLoggedIn, openAuthWall } = useAuth();
  const paletteByVariant = {
    gold: {
      accent: "#D4AF6A",
      accentStrong: "rgba(212, 175, 106, 0.6)",
      accentSoft: "rgba(212, 175, 106, 0.2)",
      accentLine: "rgba(212, 175, 106, 0.1)",
      glow: "radial-gradient(circle at 30% 20%, rgba(212, 175, 106, 0.25), rgba(155, 35, 53, 0.2) 45%, rgba(0, 0, 0, 0) 70%)",
      background: "rgba(242, 237, 228, 0.12)",
      hoverShadow:
        "0 12px 30px rgba(0,0,0,0.35), 0 0 20px rgba(212, 175, 106, 0.15)",
      badgeText: "#1a1a1a",
    },
    red: {
      accent: "#C24B45",
      accentStrong: "rgba(194, 75, 69, 0.65)",
      accentSoft: "rgba(194, 75, 69, 0.24)",
      accentLine: "rgba(194, 75, 69, 0.12)",
      glow: "radial-gradient(circle at 30% 20%, rgba(194, 75, 69, 0.24), rgba(55, 16, 18, 0.3) 45%, rgba(0, 0, 0, 0) 70%)",
      background:
        "linear-gradient(160deg, rgba(30, 12, 14, 0.94) 0%, rgba(20, 9, 11, 0.94) 55%, rgba(12, 8, 10, 0.94) 100%)",
      hoverShadow:
        "0 12px 30px rgba(0,0,0,0.48), 0 0 18px rgba(194, 75, 69, 0.2)",
      badgeText: "#1a1a1a",
    },
    rose: {
      accent: "#E77B9B",
      accentStrong: "rgba(231, 123, 155, 0.7)",
      accentSoft: "rgba(231, 123, 155, 0.32)",
      accentLine: "rgba(231, 123, 155, 0.16)",
      glow: "radial-gradient(circle at 30% 20%, rgba(231, 123, 155, 0.3), rgba(90, 20, 40, 0.25) 45%, rgba(0, 0, 0, 0) 70%)",
      background:
        "linear-gradient(160deg, rgba(48, 14, 26, 0.92) 0%, rgba(30, 10, 20, 0.92) 55%, rgba(18, 8, 14, 0.92) 100%)",
      hoverShadow:
        "0 12px 30px rgba(0,0,0,0.48), 0 0 18px rgba(231, 123, 155, 0.2)",
      badgeText: "#1a1a1a",
    },
  };

  const palette = paletteByVariant[variant] ?? paletteByVariant.gold;

  const handleAgregar = () => {
    if (!isLoggedIn) {
      openAuthWall("agregar");
      return;
    }
    onAgregar();
  };

  const handleOpen = () => {
    if (!onOpen) return;
    onOpen();
  };

  return (
    <div
      className="group relative z-10"
      role={onOpen ? "button" : undefined}
      tabIndex={onOpen ? 0 : undefined}
      onClick={handleOpen}
      onKeyDown={(event) => {
        if (!onOpen) return;
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          handleOpen();
        }
      }}
    >
      <div
        className="absolute -inset-1 rounded-[16px] opacity-0 blur-[14px] transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: palette.glow,
          pointerEvents: "none",
        }}
      />
      <div
        className="relative flex flex-col items-center p-7 transition-all duration-300 group-hover:scale-[1.03]"
        style={{
          background: palette.background,
          border: `1px solid ${palette.accentSoft}`,
          borderRadius: "12px",
          boxShadow: "0 0 0 rgba(0,0,0,0)",
          height: "410px",
          cursor: onOpen ? "pointer" : "default",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = palette.accentStrong;
          e.currentTarget.style.boxShadow = palette.hoverShadow;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = palette.accentSoft;
          e.currentTarget.style.boxShadow = "0 0 0 rgba(0,0,0,0)";
        }}
      >
        {/* Badge */}
        {badge && (
          <div
            className="absolute top-3 right-3 font-['JetBrains_Mono'] text-[9px] uppercase tracking-widest px-2 py-1"
            style={{
              background: palette.accent,
              color: palette.badgeText,
            }}
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
            border: `2px solid ${palette.accentSoft}`,
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
            className="font-['EB_Garamond'] text-[18px] text-center mb-2 line-clamp-2"
            style={{ color: "#F2EDE4", fontWeight: 400, height: "48px" }}
          >
            {nombre}
          </h3>
          <p
            className="font-['DM_Sans'] text-[12px] text-center leading-relaxed line-clamp-2 mb-4"
            style={{ color: "rgba(242, 237, 228, 0.45)", height: "40px" }}
          >
            {descripcion}
          </p>

          {/* Footer */}
          <div
            className="flex justify-between items-center w-full mt-auto pt-4"
            style={{ borderTop: `1px solid ${palette.accentLine}` }}
          >
            <span
              className="font-['JetBrains_Mono'] text-[14px]"
              style={{ color: palette.accent }}
            >
              ${precio}
            </span>
            <button
              onClick={handleAgregar}
              onMouseDown={(event) => event.stopPropagation()}
              onClickCapture={(event) => event.stopPropagation()}
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
