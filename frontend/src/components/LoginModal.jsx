import { useState } from "react";
import { createPortal } from "react-dom";
import { useAuth } from "../context/AuthContext";
// Importamos nuestros clientes de API reales
import { loginUsuario, registrarUsuario } from "../services/usuariosService";

function LoginModal() {
  const {
    showLoginModal,
    closeLoginModal,
    login,
    loginModalModo,
    openLoginModal,
    openRegisterModal,
  } = useAuth();
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [calle, setCalle] = useState("");
  const [colonia, setColonia] = useState("");
  const [codigoPostal, setCodigoPostal] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [errorMensaje, setErrorMensaje] = useState(""); // 👈 Para pintar alertas en UI

  const esRegistro = loginModalModo === "register";

  if (!showLoginModal) return null;

  // Lógica de Login Real conectada a Docker
  const handleLogin = async () => {
    if (!email || !password) return;
    setErrorMensaje("");
    
    try {
      const data = await loginUsuario(email, password);
      if (data.ok && data.token) {
        // Guardar sesión real en Contexto y LocalStorage
        login(data.usuario, data.token);
        setEmail("");
        setPassword("");
      } else {
        setErrorMensaje(data.message || "Credenciales incorrectas");
      }
    } catch (err) {
      setErrorMensaje(err.response?.data?.message || "Error al conectar con el servidor de autenticación.");
    }
  };

  // Lógica de Registro Real conectada a Docker
  const handleRegister = async () => {
    if (
      !nombre ||
      !telefono ||
      !calle ||
      !colonia ||
      !codigoPostal ||
      !email ||
      !password
    ) {
      setErrorMensaje("Por favor completa todos los campos requeridos.");
      return;
    }
    setErrorMensaje("");

    try {
      const direccionCompleta = `${calle}, ${colonia}, C.P. ${codigoPostal}`;
      
      // 1. Crear la cuenta en el backend
      await registrarUsuario({
        nombre,
        telefono,
        direccion: direccionCompleta,
        email,
        password,
        rol: "cliente" // El registro desde el modal de cliente siempre nace con rol 'cliente'
      });

      // 2. Auto-login inmediato en segundo plano para no obligarlo a escribir de nuevo
      const loginData = await loginUsuario(email, password);
      login(loginData.usuario, loginData.token);

      // Limpiar estados
      setNombre("");
      setTelefono("");
      setCalle("");
      setColonia("");
      setCodigoPostal("");
      setEmail("");
      setPassword("");
    } catch (err) {
      setErrorMensaje(err.response?.data?.message || "Error al realizar el registro de la cuenta.");
    }
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
          maxHeight: "calc(100vh - 40px)",
          margin: "20px 16px",
          padding: "28px 28px 32px",
          backgroundColor: "#1A1A1A",
          border: "1px solid rgba(212, 175, 106, 0.25)",
          overflowY: "auto",
          overscrollBehavior: "contain",
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
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "12px",
              color: "rgba(242, 237, 228, 0.65)",
              marginBottom: "4px",
            }}
          >
            {esRegistro ? "Registrarme" : "Iniciar sesion"}
          </p>
          <h2
            style={{
              fontFamily: "'EB Garamond', serif",
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
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "12px",
              color: "rgba(242, 237, 228, 0.45)",
              marginTop: "6px",
            }}
          >
            {esRegistro
              ? "Completa tus datos para continuar"
              : "Ingresa con tu correo y contrasena"}
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
          {esRegistro && (
            <>
              {/* Nombre */}
              <div
                style={{ display: "flex", flexDirection: "column", gap: "4px" }}
              >
                <label
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "12px",
                    color: "rgba(242, 237, 228, 0.7)",
                  }}
                >
                  Nombre
                </label>
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Tu nombre"
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    fontFamily: "'DM Sans', sans-serif",
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

              {/* Telefono */}
              <div
                style={{ display: "flex", flexDirection: "column", gap: "4px" }}
              >
                <label
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "12px",
                    color: "rgba(242, 237, 228, 0.7)",
                  }}
                >
                  Telefono
                </label>
                <input
                  type="tel"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  placeholder="(000) 000 0000"
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    fontFamily: "'DM Sans', sans-serif",
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

              {/* Calle */}
              <div
                style={{ display: "flex", flexDirection: "column", gap: "4px" }}
              >
                <label
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "12px",
                    color: "rgba(242, 237, 228, 0.7)",
                  }}
                >
                  Calle
                </label>
                <input
                  type="text"
                  value={calle}
                  onChange={(e) => setCalle(e.target.value)}
                  placeholder="Calle y numero"
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    fontFamily: "'DM Sans', sans-serif",
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

              {/* Colonia */}
              <div
                style={{ display: "flex", flexDirection: "column", gap: "4px" }}
              >
                <label
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "12px",
                    color: "rgba(242, 237, 228, 0.7)",
                  }}
                >
                  Colonia
                </label>
                <input
                  type="text"
                  value={colonia}
                  onChange={(e) => setColonia(e.target.value)}
                  placeholder="Colonia"
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    fontFamily: "'DM Sans', sans-serif",
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

              {/* Codigo postal */}
              <div
                style={{ display: "flex", flexDirection: "column", gap: "4px" }}
              >
                <label
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "12px",
                    color: "rgba(242, 237, 228, 0.7)",
                  }}
                >
                  Codigo postal
                </label>
                <input
                  type="text"
                  value={codigoPostal}
                  onChange={(e) => setCodigoPostal(e.target.value)}
                  placeholder="00000"
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    fontFamily: "'DM Sans', sans-serif",
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
            </>
          )}

          {/* Correo */}
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <label
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "12px",
                color: "rgba(242, 237, 228, 0.7)",
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
                fontFamily: "'DM Sans', sans-serif",
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
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "12px",
                color: "rgba(242, 237, 228, 0.7)",
              }}
            >
              Contraseña
            </label>
            <div style={{ position: "relative" }}>
              <input
                type={mostrarPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{
                  width: "100%",
                  padding: "8px 36px 8px 12px",
                  fontFamily: "'DM Sans', sans-serif",
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
                onKeyDown={(e) =>
                  e.key === "Enter" &&
                  (esRegistro ? handleRegister() : handleLogin())
                }
              />
              <button
                type="button"
                onClick={() => setMostrarPassword((prev) => !prev)}
                aria-label={
                  mostrarPassword ? "Ocultar contrasena" : "Mostrar contrasena"
                }
                style={{
                  position: "absolute",
                  top: "50%",
                  right: "10px",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  color: "rgba(242, 237, 228, 0.6)",
                  cursor: "pointer",
                  padding: 0,
                  lineHeight: 1,
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#D4AF6A")}
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "rgba(242, 237, 228, 0.6)")
                }
              >
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: "18px" }}
                >
                  {mostrarPassword ? "visibility_off" : "visibility"}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Mostrar mensaje de error si existe */}
        {errorMensaje && (
          <div
            style={{
              marginBottom: "12px",
              padding: "8px 10px",
              backgroundColor: "rgba(155, 35, 53, 0.12)",
              color: "#F2EDE4",
              fontSize: "12px",
              border: "1px solid rgba(155, 35, 53, 0.25)",
            }}
          >
            {errorMensaje}
          </div>
        )}

        {/* Botón */}
        <button
          onClick={esRegistro ? handleRegister : handleLogin}
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
          {esRegistro ? "Registrarme" : "Iniciar sesion"}
        </button>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "12px",
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "12px",
            color: "rgba(242, 237, 228, 0.6)",
            gap: "6px",
          }}
        >
          <span>{esRegistro ? "Ya tengo una cuenta" : "No tengo cuenta"}</span>
          <button
            onClick={esRegistro ? openLoginModal : openRegisterModal}
            style={{
              background: "none",
              border: "none",
              color: "#D4AF6A",
              cursor: "pointer",
              padding: 0,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.7")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            {esRegistro ? "Iniciar sesion" : "Registrarme"}
          </button>
        </div>

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
