import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Inicialización inteligente: recuperar sesión previa si existe
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem("token") ? true : false;
  });

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showAuthWall, setShowAuthWall] = useState(false);
  const [authWallMotivo, setAuthWallMotivo] = useState(null);

  // Iniciar sesión (Cliente o Sucursal) guardando JWT y datos
  const login = (userData, token) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
    setIsLoggedIn(true);
    setShowLoginModal(false);
    setShowAuthWall(false);
  };

  // Iniciar sesión de Administrador
  const loginAdmin = (userData, token) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
    setIsLoggedIn(true);
  };

  // Cerrar sesión limpiando credenciales del navegador
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setIsLoggedIn(false);
  };

  const openAuthWall = (motivo) => {
    setAuthWallMotivo(motivo);
    setShowAuthWall(true);
  };

  const closeAuthWall = () => {
    setShowAuthWall(false);
    setAuthWallMotivo(null);
  };

  const confirmarAuthWall = () => {
    setShowAuthWall(false);
    setShowLoginModal(true);
  };

  const closeLoginModal = () => setShowLoginModal(false);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        user,
        login,
        loginAdmin,
        logout,
        showLoginModal,
        closeLoginModal,
        showAuthWall,
        authWallMotivo,
        openAuthWall,
        closeAuthWall,
        confirmarAuthWall,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return useContext(AuthContext);
}
