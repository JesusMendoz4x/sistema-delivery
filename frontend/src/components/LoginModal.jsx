import { useState } from "react";
import { createPortal } from "react-dom";
import { useAuth } from "../context/AuthContext";

function LoginModal() {
  const { showLoginModal, closeLoginModal, login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  if (!showLoginModal) return null;

  const handleLogin = () => {
    if (!email || !password) return;
    login({ nombre: email.split("@")[0] });
    setEmail("");
    setPassword("");
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) closeLoginModal();
  };

  return createPortal(
    <div
      onClick={handleBackdropClick}
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
          maxWidth: "320px",
          margin: "0 16px",
          padding: "28px 28px 32px",
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

        {/* Encabezado */}
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <p
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "9px",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "rgba(212, 175, 106, 0.6)",
              marginBottom: "4px",
            }}
          >
            Acceso al portal
          </p>
          <h2
            style={{
              fontFamily: "'Outfit', serif",
              fontSize: "24px",
              color: "#F2EDE4",
              letterSpacing: "0.05em",
              margin: 0,
            }}
          >
            Casablanca
          </h2>
          <p
            style={{
              fontFamily: "'Nunito', sans-serif",
              fontSize: "12px",
              color: "rgba(242, 237, 228, 0.45)",
              marginTop: "6px",
            }}
          >
            Inicia sesión para agregar platillos
          </p>
        </div>

        {/* Campos */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            marginBottom: "20px",
          }}
        >
          {/* Correo */}
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <label
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "9px",
                textTransform: "uppercase",
                letterSpacing: "0.18em",
                color: "rgba(212, 175, 106, 0.7)",
              }}
            >
              Correo
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@correo.com"
              style={{
                width: "100%",
                padding: "8px 12px",
                fontFamily: "'Nunito', sans-serif",
                fontSize: "13px",
                color: "#F2EDE4",
                backgroundColor: "#3D3530",
                border: "1px solid rgba(212, 175, 106, 0.15)",
                outline: "none",
                boxSizing: "border-box",
              }}
              onFocus={(e) =>
                (e.target.style.borderColor = "rgba(212, 175, 106, 0.5)")
              }
              onBlur={(e) =>
                (e.target.style.borderColor = "rgba(212, 175, 106, 0.15)")
              }
            />
          </div>

          {/* Contraseña */}
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <label
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "9px",
                textTransform: "uppercase",
                letterSpacing: "0.18em",
                color: "rgba(212, 175, 106, 0.7)",
              }}
            >
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{
                width: "100%",
                padding: "8px 12px",
                fontFamily: "'Nunito', sans-serif",
                fontSize: "13px",
                color: "#F2EDE4",
                backgroundColor: "#3D3530",
                border: "1px solid rgba(212, 175, 106, 0.15)",
                outline: "none",
                boxSizing: "border-box",
              }}
              onFocus={(e) =>
                (e.target.style.borderColor = "rgba(212, 175, 106, 0.5)")
              }
              onBlur={(e) =>
                (e.target.style.borderColor = "rgba(212, 175, 106, 0.15)")
              }
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            />
          </div>
        </div>

        {/* Botón */}
        <button
          onClick={handleLogin}
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
          onMouseEnter={(e) => (e.target.style.opacity = "0.8")}
          onMouseLeave={(e) => (e.target.style.opacity = "1")}
        >
          Iniciar sesión
        </button>

        {/* Cerrar */}
        <button
          onClick={closeLoginModal}
          style={{
            position: "absolute",
            top: "12px",
            right: "12px",
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "rgba(242, 237, 228, 0.3)",
            padding: 0,
            lineHeight: 1,
          }}
          onMouseEnter={(e) => (e.target.style.color = "#D4AF6A")}
          onMouseLeave={(e) =>
            (e.target.style.color = "rgba(242, 237, 228, 0.3)")
          }
          aria-label="Cerrar"
        >
          <span
            className="material-symbols-outlined"
            style={{ fontSize: "18px" }}
          >
            close
          </span>
        </button>

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

export default LoginModal;
