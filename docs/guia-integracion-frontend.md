# Guía Maestra de Integración: Conexión Real Frontend-Backend

Esta guía detalla los pasos exactos y los fragmentos de código listos para copiar y pegar que el equipo de Frontend debe implementar para conectar las pantallas de React con los microservicios seguros y orquestados del Backend a través del **API Gateway (Puerto 5000)**.

---

## 1. Configuración de la Instancia de Axios e Interceptor JWT

El primer paso es activar la comunicación HTTP global y asegurar que cada petición lleve el Token JWT del usuario autenticado de forma automática en la cabecera `Authorization`.

### Archivo a modificar: `frontend/src/services/api.js`
Reemplazar el contenido completo de este archivo por el siguiente código:

```javascript
import axios from 'axios';

// Instancia centralizada de Axios apuntando al puerto del API Gateway
const api = axios.create({
  baseURL: 'http://localhost:5000/api', 
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' }
});

// Interceptor de peticiones para inyectar automáticamente el token JWT
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
export const API_BASE_URL = 'http://localhost:5000/api';
```

---

## 2. Integración de la Autenticación Real (Contexto y Login)

Actualmente `AuthContext.jsx` simula un inicio de sesión local estático. Debemos conectarlo a nuestro servicio de usuarios real para validar contraseñas cifradas y persistir la sesión.

### Paso A: Crear el archivo `frontend/src/services/usuariosService.js`
Crear este nuevo archivo con el siguiente contenido:

```javascript
import api from './api';

/**
 * Envía credenciales al microservicio de usuarios para iniciar sesión y obtener JWT.
 * @param {string} email Correo del usuario.
 * @param {string} password Contraseña.
 */
export const loginUsuario = async (email, password) => {
  const response = await api.post('/usuarios/login', { email, password });
  return response.data; // Retorna { ok: true, usuario: {...}, token: "JWT..." }
};
```

### Paso B: Modificar `frontend/src/context/AuthContext.jsx`
Modificar las funciones `login` y `loginAdmin` para que acepten y guarden el token real en `localStorage`:

```javascript
// Reemplazar la función login en AuthContext.jsx:
const login = (userData, token) => {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(userData));
  setUser(userData);
  setIsLoggedIn(true);
  setShowLoginModal(false);
  setShowAuthWall(false);
};

// Reemplazar la función loginAdmin en AuthContext.jsx:
const loginAdmin = (userData, token) => {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(userData));
  setUser(userData);
  setIsLoggedIn(true);
};

// Reemplazar la función logout para limpiar localStorage:
const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  setUser(null);
  setIsLoggedIn(false);
};
```

---

## 3. Reemplazo de Mocks en el Catálogo de Productos

Debemos enlazar el catálogo de productos con la base de datos de Docker para que cargue los platillos en tiempo real.

### Archivo a modificar: `frontend/src/services/productosService.js`
Reemplazar el contenido completo de este archivo para eliminar la variable `MOCK_DATA` e integrar Axios:

```javascript
import api from './api';

export const getProductos = async () => {
  const response = await api.get('/productos');
  return response.data; // Retorna el array de productos de MongoDB
};

export const createProducto = async (data) => {
  const response = await api.post('/productos', data);
  return response.data;
};

export const updateProducto = async (id, data) => {
  const response = await api.put(`/productos/${id}`, data);
  return response.data;
};

export const deleteProducto = async (id) => {
  const response = await api.delete(`/productos/${id}`);
  return response.data;
};
```

---

## 4. Realizar el Pedido y WebSockets en Tiempo Real

El flujo de compra requiere enviar la orden al backend (el cual calcula la sucursal más cercana por Haversine y asigna un repartidor disponible) y escuchar el progreso en tiempo real.

### Paso A: Crear el archivo `frontend/src/services/pedidosService.js`
Crear este nuevo archivo para realizar las peticiones HTTP de compras:

```javascript
import api from './api';

/**
 * Crea un nuevo pedido orquestado enviando coordenadas y productos del carrito.
 */
export const crearPedidoReal = async (pedidoData) => {
  const response = await api.post('/pedidos', pedidoData);
  return response.data;
};

/**
 * Obtiene el listado de pedidos realizados por el cliente.
 */
export const getPedidosCliente = async () => {
  const response = await api.get('/pedidos');
  return response.data;
};
```

### Paso B: Integración de WebSockets en `ClienteHome.jsx`
El frontend ya tiene cargado `socket.io-client`. Aseguren que apunte al puerto `5000` del Gateway y escuche el evento `pedido_actualizado` para refrescar la barra de estados dinámicamente:

```javascript
// Dentro de ClienteHome.jsx, en el useEffect de Socket:
useEffect(() => {
  // Apuntar al puerto 5000 del API Gateway
  const socket = io("http://localhost:5000");

  socket.on("connect", () => {
    console.log("[WS] Conectado al API Gateway via WebSocket");
  });

  // Registrar unión a sala de cada pedido para recibir sus actualizaciones exclusivas
  pedidos.forEach(pedido => {
    socket.emit("join_pedido", pedido._id || pedido.id);
  });

  socket.on("pedido_actualizado", (data) => {
    console.log("[WS] Pedido actualizado recibido:", data);
    setPedidos((prev) => 
      prev.map((p) => {
        // Soporte para IDs locales o de MongoDB (_id)
        const pId = String(p._id || p.id);
        if (pId === String(data.pedidoId)) {
          return {
            ...p,
            estado: data.estado,
            repartidorId: data.repartidorId,
            ruta: data.ruta
          };
        }
        return p;
      })
    );
  });

  return () => {
    socket.disconnect();
  };
}, [pedidos]);
```

---

## 5. Vinculación de Pantallas Administrativas

Las pantallas de administración del inventario y repartidores deben cargar sus datos de MongoDB en lugar de usar variables estáticas en memoria.

### Paso A: Crear el archivo `frontend/src/services/inventarioService.js`
Crear este archivo para la consulta de stocks físicos por sucursal:

```javascript
import api from './api';

// Obtiene el inventario físico de una sucursal en MongoDB
export const getInventarioSucursal = async (sucursalId) => {
  const response = await api.get(`/inventario/sucursal/${sucursalId}`);
  return response.data;
};

// Actualiza el stock de un producto específico en una sucursal
export const actualizarStock = async (productoId, sucursalId, stock) => {
  const response = await api.post('/inventario/stock', { productoId, sucursalId, stock });
  return response.data;
};
```

### Paso B: Crear el archivo `frontend/src/services/repartidoresService.js`
Crear este archivo para gestionar los conductores de delivery:

```javascript
import api from './api';

export const getRepartidores = async () => {
  const response = await api.get('/repartidores');
  return response.data;
};

export const crearRepartidor = async (data) => {
  const response = await api.post('/repartidores', data);
  return response.data;
};

export const activarRepartidor = async (id) => {
  const response = await api.put(`/repartidores/${id}/activar`);
  return response.data;
};
```
