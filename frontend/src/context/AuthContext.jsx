import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

// motivo: "agregar" | "pedidos"
export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginModalModo, setLoginModalModo] = useState("login");
  const [showAuthWall, setShowAuthWall] = useState(false);
  const [authWallMotivo, setAuthWallMotivo] = useState(null);

  const login = (userData = { nombre: "Cliente", rol: "cliente" }) => {
    setUser(userData);
    setIsLoggedIn(true);
    setShowLoginModal(false);
    setShowAuthWall(false);
  };

  const loginAdmin = () => {
    setUser({
      nombre: "Administrador",
      rol: "admin",
      email: "admin@sistema.com",
    });
    setIsLoggedIn(true);
  };

  const logout = () => {
    setUser(null);
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
        login,
        loginAdmin,
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
