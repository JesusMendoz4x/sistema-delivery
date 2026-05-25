import { BrowserRouter, Routes, Route } from "react-router-dom";
import ClienteHome from "./pages/ClienteHome";
import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsuarios from "./pages/admin/AdminUsuarios";
import AdminPedidos from "./pages/admin/AdminPedidos";
import AdminProductos from "./pages/admin/AdminProductos";
import AdminLogin from "./pages/admin/AdminLogin";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Rutas de Cliente */}
          <Route path="/" element={<ClienteHome />} />

          {/* Rutas Públicas Administrativas */}
          <Route path="/login" element={<AdminLogin />} />

          {/* Rutas de Administrador Protegidas */}
          <Route element={<ProtectedRoute allowedRole="admin" />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="usuarios" element={<AdminUsuarios />} />
              <Route path="pedidos" element={<AdminPedidos />} />
              <Route path="productos" element={<AdminProductos />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
