import { createContext, useContext, useState } from "react";
import { login as loginRequest, createUsuario } from "../services/usuariosService";

const AuthContext = createContext(null);

// Recupera la sesión persistida (si el usuario ya había iniciado sesión).
function leerSesionInicial() {
  try {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "null");
    return { token, user, isLoggedIn: Boolean(token && user) };
  } catch {
    return { token: null, user: null, isLoggedIn: false };
  }
}

// motivo: "agregar" | "pedidos"
export function AuthProvider({ children }) {
  const sesion = leerSesionInicial();
  const [isLoggedIn, setIsLoggedIn] = useState(sesion.isLoggedIn);
  const [user, setUser] = useState(sesion.user);
  const [token, setToken] = useState(sesion.token);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginModalModo, setLoginModalModo] = useState("login");
  const [showAuthWall, setShowAuthWall] = useState(false);
  const [authWallMotivo, setAuthWallMotivo] = useState(null);

  // Persiste sesión y actualiza el estado de React.
  const guardarSesion = (usuario, jwt) => {
    localStorage.setItem("token", jwt);
    localStorage.setItem("user", JSON.stringify(usuario));
    setUser(usuario);
    setToken(jwt);
    setIsLoggedIn(true);
  };

  // Login real contra el backend (POST /api/usuarios/login).
  // Devuelve { ok, error?, rol? } para que el caller decida la navegación.
  const iniciarSesion = async (email, password) => {
    try {
      const data = await loginRequest(email, password);
      if (!data?.token) {
        return { ok: false, error: data?.message || "Credenciales incorrectas" };
      }
      guardarSesion(data.usuario, data.token);
      setShowLoginModal(false);
      setShowAuthWall(false);
      return { ok: true, rol: data.usuario?.rol };
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        error.message ||
        "No se pudo iniciar sesión";
      return { ok: false, error: msg };
    }
  };

  // Registro de cliente (POST /api/usuarios) + auto-login.
  const registrar = async (datos) => {
    try {
      await createUsuario({ ...datos, rol: "cliente" });
      // Inicia sesión automáticamente con las credenciales recién creadas.
      return await iniciarSesion(datos.email, datos.password);
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        error.message ||
        "No se pudo completar el registro";
      return { ok: false, error: msg };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setToken(null);
    setIsLoggedIn(false);
  };

  // AuthWall → LoginModal
  const openAuthWall = (motivo) => {
    setAuthWallMotivo(motivo);
    setShowAuthWall(true);
  };

  const closeAuthWall = () => {
    setShowAuthWall(false);
    setAuthWallMotivo(null);
  };

  const openLoginModal = () => {
    setLoginModalModo("login");
    setShowAuthWall(false);
    setShowLoginModal(true);
  };

  const openRegisterModal = () => {
    setLoginModalModo("register");
    setShowAuthWall(false);
    setShowLoginModal(true);
  };

  const closeLoginModal = () => setShowLoginModal(false);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        user,
        token,
        iniciarSesion,
        registrar,
        logout,
        showLoginModal,
        loginModalModo,
        openLoginModal,
        openRegisterModal,
        closeLoginModal,
        showAuthWall,
        authWallMotivo,
        openAuthWall,
        closeAuthWall,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
