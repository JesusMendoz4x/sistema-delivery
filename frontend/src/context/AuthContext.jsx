import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

// motivo: "agregar" | "pedidos"
export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showAuthWall, setShowAuthWall] = useState(false);
  const [authWallMotivo, setAuthWallMotivo] = useState(null);

  const login = (userData = { nombre: "Cliente" }) => {
    setUser(userData);
    setIsLoggedIn(true);
    setShowLoginModal(false);
    setShowAuthWall(false);
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

export function useAuth() {
  return useContext(AuthContext);
}
