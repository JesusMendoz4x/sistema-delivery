import { createPortal } from "react-dom";
import { useAuth } from "../context/AuthContext";

const MENSAJES = {
  agregar: {
    titulo: "Acceso requerido",
    cuerpo:
      "Para agregar platillos a tu orden necesitas una cuenta. ¿Deseas iniciar sesión?",
  },
  pedidos: {
    titulo: "Acceso requerido",
    cuerpo:
      "El historial de pedidos solo está disponible para usuarios registrados. ¿Deseas iniciar sesión?",
  },
};

function AuthWall() {
  const { showAuthWall, authWallMotivo, closeAuthWall, confirmarAuthWall } =
    useAuth();

  if (!showAuthWall) return null;

  const { titulo, cuerpo } = MENSAJES[authWallMotivo] ?? MENSAJES.agregar;

  return createPortal(
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) closeAuthWall();
      }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(10, 10, 10, 0.88)",
        backdropFilter: "blur(6px)",
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "340px",
          margin: "0 16px",
          padding: "32px 28px 28px",
          backgroundColor: "#1A1A1A",
          border: "1px solid rgba(212, 175, 106, 0.25)",
        }}
      >
        {/* Línea dorada superior */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "28px",
            right: "28px",
            height: "1px",
            backgroundColor: "rgba(212, 175, 106, 0.4)",
          }}
        />

        {/* Ícono */}
        <div style={{ textAlign: "center", marginBottom: "16px" }}>
          <span
            className="material-symbols-outlined"
            style={{ fontSize: "28px", color: "#D4AF6A", opacity: 0.7 }}
          >
            lock
          </span>
        </div>

        {/* Texto */}
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <p
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "9px",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "rgba(212, 175, 106, 0.6)",
              marginBottom: "8px",
            }}
          >
            {titulo}
          </p>
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "13px",
              color: "rgba(242, 237, 228, 0.65)",
              lineHeight: "1.6",
              margin: 0,
            }}
          >
            {cuerpo}
          </p>
        </div>

        {/* Acciones */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <button
            onClick={confirmarAuthWall}
            style={{
              width: "100%",
              padding: "10px",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "10px",
              textTransform: "uppercase",
              letterSpacing: "0.18em",
              color: "#F2EDE4",
              backgroundColor: "#9B2335",
              border: "none",
              cursor: "pointer",
              transition: "opacity 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.8")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            Iniciar sesión
          </button>

          <button
            onClick={closeAuthWall}
            style={{
              width: "100%",
              padding: "10px",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "10px",
              textTransform: "uppercase",
              letterSpacing: "0.18em",
              color: "rgba(242, 237, 228, 0.4)",
              backgroundColor: "transparent",
              border: "1px solid rgba(212, 175, 106, 0.15)",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#D4AF6A";
              e.currentTarget.style.borderColor = "rgba(212, 175, 106, 0.4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "rgba(242, 237, 228, 0.4)";
              e.currentTarget.style.borderColor = "rgba(212, 175, 106, 0.15)";
            }}
          >
            Cancelar
          </button>
        </div>

        {/* Línea dorada inferior */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: "28px",
            right: "28px",
            height: "1px",
            backgroundColor: "rgba(212, 175, 106, 0.4)",
          }}
        />
      </div>
    </div>,
    document.body,
  );
}

export default AuthWall;
