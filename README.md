# Sistema de Pedidos a Domicilio Basado en Microservicios 

**INSTITUTO TECNOLÓGICO DE OAXACA**  
Tecnológico Nacional de México  
Ingeniería en Sistemas Computacionales  
Desarrollo de Servicios Web  
**PROYECTO INTEGRADOR**

---

## Integrantes del Equipo (Grupo 8SC, Semestre 8.º)

| Nombre | Número de Control |
|--------|-------------------|
| Solano Ramos Eduardo | 22161254 |
| Mendoza Chávez Jesús Abraham | 22161168 |
| Porras Avendaño Sergio Ezequiel | 22161208 |
| Plácido Martínez Cristian Gerardo | 22161206 |
| Franco Matías Uziel | 22161061 |
| Mendoza Durán Juan Francisco | 22161163 |
| Martinez Miguel Jonathan Eliezer | 22161140 |


**Docente:** Alonso Hernández Luis Alberto  
**Fecha:** 31 de mayo de 2026
---
**Equipo:** Equipo1C
---

## Descripción del Proyecto

Sistema de **delivery multisucursal** donde los clientes realizan sus pedidos en línea. La plataforma asigna automáticamente la sucursal más cercana, valida y descuenta el inventario, asigna un repartidor disponible y notifica en tiempo real el avance del pedido tanto al cliente como al panel de administración.

Está construido con una **arquitectura de microservicios** (Node.js / Express + MongoDB) detrás de un **API Gateway**, un **frontend en React 19 + Vite** y comunicación en tiempo real mediante **Socket.IO**. Todo el ecosistema es orquestable con **Docker Compose**.

---

## Arquitectura de microservicios

```
                        ┌──────────────────────────┐
                        │   Frontend (React+Vite)   │
                        │   Nginx  ->  :8109         │
                        └────────────┬──────────────┘
                                     │  /api  +  /socket.io
                                     ▼
                        ┌──────────────────────────┐
                        │      API Gateway :5000     │
                        │  Auth JWT · RBAC · Proxy   │
                        │  Rate limit · Socket.IO    │
                        └────────────┬──────────────┘
        ┌───────────────┬────────────┼────────────┬───────────────┬───────────────┐
        ▼               ▼            ▼            ▼               ▼               ▼
 ┌────────────┐ ┌────────────┐ ┌──────────┐ ┌────────────┐ ┌────────────┐ ┌──────────────┐
 │ usuario    │ │ inventario │ │ pedidos  │ │ sucursales │ │repartidores│ │ enrutamiento │
 │  :3005     │ │  :3001     │ │  :3003   │ │  :3002     │ │  :3004     │ │   :3006      │
 └─────┬──────┘ └─────┬──────┘ └────┬─────┘ └─────┬──────┘ └─────┬──────┘ └──────┬───────┘
       │              │             │             │              │              │
       ▼              ▼             ▼             ▼              ▼              ▼
                          ┌──────────────────────────┐
                          │   MongoDB  :27017          │
                          │  (una base de datos por    │
                          │       microservicio)       │
                          └──────────────────────────┘
```

**Principios de diseño aplicados:**

- **Database per Service**: cada microservicio es dueño de su propia base de datos en MongoDB.
- **API Gateway** como punto único de entrada: enruta, autentica (JWT), aplica control de acceso por roles (RBAC) y *rate limiting*.
- **Resiliencia**: las llamadas entre servicios usan reintentos + degradación elegante (*fallbacks*) para evitar fallos en cascada.
- **Tiempo real** vía WebSockets (Socket.IO) para notificar cambios de estado del pedido.
- **Trazabilidad** mediante propagación de `x-correlation-id` entre servicios.

---

## Servicios y puertos

| Servicio | Puerto | Base de datos | Responsabilidad |
|----------|--------|---------------|-----------------|
| **API Gateway** | `5000` | — | Punto de entrada único, autenticación JWT, RBAC, proxy, rate limiting y Socket.IO |
| **usuario-service** | `3005` | `usuariosdb` | Registro, login (JWT) y gestión de usuarios |
| **inventario-service** | `3001` | `productosdb` | Catálogo de productos y stock por sucursal |
| **sucursales-service** | `3002` | `delivery_sucursales` | Gestión de sucursales y su ubicación geográfica |
| **pedidos-service** | `3003` | `pedidosdb` | Orquestación y ciclo de vida del pedido |
| **repartidores-service** | `3004` | `repartidoresdb` | Gestión y disponibilidad de repartidores |
| **enrutamiento-service** | `3006` | `enrutamientodb` | Cálculo de sucursal más cercana y rutas de entrega |
| **frontend** | `8109` | — | SPA de React servida por Nginx (punto de acceso para el usuario) |
| **mongodb** | `27017` | — | Base de datos central del ecosistema en contenedores |

> **Punto de acceso:** con Docker Compose, el sistema se accede a través del **frontend en `http://localhost:8109`**. Nginx hace proxy de `/api` y `/socket.io` hacia el API Gateway (`api-gateway:5000`) dentro de la red interna de Docker.

---

## Requisitos previos

- **Docker** y **Docker Compose** (la forma recomendada de levantar todo el ecosistema).
- **Node.js** (v16 o superior) y **npm** — necesarios para ejecutar el *seeder* (`seed.js`) y el frontend en modo desarrollo.

> Los microservicios incluyen un *polyfill* de Web Crypto para ser compatibles con **Node.js v16** (ver [`docs/nfr-crypto-compatibilidad.md`](docs/nfr-crypto-compatibilidad.md)).

---

## Cómo levantarlo paso a paso (Docker Compose)

1. **Clonar el repositorio y entrar a la carpeta:**

   ```bash
   git clone <url-del-repo>
   cd sistema-delivery
   ```

2. **Crear el archivo de variables de entorno** a partir del ejemplo:

   ```bash
   cp .env.example .env
   ```

   Ajusta los valores si lo necesitas (por ejemplo `GATEWAY_PORT` o `JWT_SECRET`).

3. **Levantar todo el ecosistema** (MongoDB + 7 servicios + frontend):

   ```bash
   docker compose up -d --build
   ```

4. **Sembrar datos de prueba** (usuarios, sucursal, productos, inventario y repartidores):

   ```bash
   node seed.js
   ```

   > El *seeder* se conecta a la base local en `mongodb://127.0.0.1:27017` (gracias al puerto `27017` expuesto por el contenedor de MongoDB).

5. **Acceder a la aplicación:**

   - Frontend (clientes y admin): **http://localhost:8109**
   - Documentación de la API (Swagger): se sirve desde el API Gateway en `/api-docs`.

### Modo desarrollo (frontend con Vite)

Para trabajar en el frontend con *hot reload*, en lugar del contenedor Nginx puedes levantarlo con Vite:

```bash
cd frontend
npm install
npm run dev
```

El frontend de desarrollo apunta al gateway según la variable `VITE_API_URL` definida en `frontend/.env`.

---

## Usuarios de prueba

Generados por `seed.js` (las contraseñas se cifran con bcrypt al sembrar):

| Rol | Email | Contraseña |
|-----|-------|------------|
| **Admin** | `admin@delivery.com` | `adminpassword` |
| **Cliente** | `juan@delivery.com` | `clientepassword` |

El *seeder* también crea una sucursal (`Sucursal Centro`, Oaxaca), 7 productos con stock de 100 unidades y 3 repartidores de prueba (`carlos@repartidor.com`, `sofia@repartidor.com`, `miguel@repartidor.com`).

---

## Resumen de endpoints principales por servicio

> Todas las rutas se consumen a través del API Gateway con el prefijo `/api`. Las rutas marcadas como *(auth)* requieren un token JWT (`Authorization: Bearer <token>`).

### usuario-service (`/api/usuarios`)
| Método | Ruta | Descripción |
|--------|------|-------------|
| `POST` | `/api/usuarios` | Registrar un nuevo usuario (público) |
| `POST` | `/api/usuarios/login` | Iniciar sesión, devuelve JWT (público) |
| `GET` | `/api/usuarios` | Listar usuarios *(auth)* |
| `GET` | `/api/usuarios/:id` | Obtener usuario por ID *(auth)* |
| `PUT` | `/api/usuarios/:id` | Actualizar perfil *(auth)* |
| `DELETE` | `/api/usuarios/:id/desactivar` | Desactivar usuario *(admin)* |
| `PUT` | `/api/usuarios/:id/activar` | Reactivar usuario *(admin)* |

### inventario-service (`/api/productos`, `/api/inventario`)
| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/api/inventario` | Listar catálogo de productos (público) |
| `GET` | `/api/inventario/:id` | Obtener producto por ID (público) |
| `POST` | `/api/inventario` | Crear producto, admite imagen *(admin/sucursal)* |
| `PUT` | `/api/inventario/:id` | Actualizar producto *(admin/sucursal)* |
| `DELETE` | `/api/inventario/:id` | Eliminar producto e inventarios *(admin)* |
| `GET` | `/api/inventario/sucursal/:sucursalId` | Stock disponible en una sucursal |
| `POST` | `/api/inventario/stock` | Inicializar/actualizar stock *(admin/sucursal)* |
| `POST` | `/api/inventario/validar-y-descontar` | Validar y descontar stock (interno) |

### sucursales-service (`/api/sucursales`)
| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/api/sucursales` | Listar sucursales activas (público) |
| `GET` | `/api/sucursales/:id` | Obtener sucursal por ID (público) |
| `POST` | `/api/sucursales` | Crear sucursal *(admin)* |
| `PUT` | `/api/sucursales/:id` | Actualizar sucursal *(admin)* |
| `DELETE` | `/api/sucursales/:id` | Desactivar sucursal *(admin)* |

### pedidos-service (`/api/pedidos`)
| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/api/pedidos` | Listar pedidos *(auth)* |
| `GET` | `/api/pedidos/:id` | Obtener pedido por ID *(auth)* |
| `GET` | `/api/pedidos/metricas` | Métricas del dashboard *(auth)* |
| `POST` | `/api/pedidos` | Crear pedido *(cliente/admin/sucursal)* |
| `PUT` | `/api/pedidos/:id/estado` | Actualizar estado del pedido *(admin)* |
| `PUT` | `/api/pedidos/:id/repartidor` | Asignar repartidor *(admin)* |

### repartidores-service (`/api/repartidores`)
| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/api/repartidores` | Listar repartidores (público) |
| `GET` | `/api/repartidores/:id` | Obtener repartidor por ID (público) |
| `POST` | `/api/repartidores` | Crear repartidor *(admin)* |
| `PUT` | `/api/repartidores/:id` | Actualizar repartidor *(admin)* |
| `DELETE` | `/api/repartidores/:id/desactivar` | Desactivar repartidor *(admin)* |
| `PUT` | `/api/repartidores/:id/activar` | Reactivar repartidor *(admin)* |
| `POST` | `/api/repartidores/asignar` | Asignar repartidor disponible (interno) |

### enrutamiento-service (`/api/enrutamiento`, `/api/rutas`)
| Método | Ruta | Descripción |
|--------|------|-------------|
| `POST` | `/api/enrutamiento/calcular-cercana` | Calcular sucursal más cercana (Haversine) |
| `GET` | `/api/rutas` | Listar rutas *(admin/sucursal)* |
| `GET` | `/api/rutas/:id` | Obtener ruta por ID *(admin/sucursal)* |
| `POST` | `/api/rutas` | Crear ruta de entrega *(admin/sucursal)* |
| `PUT` | `/api/rutas/:id/estado` | Actualizar estado de la ruta *(admin/sucursal)* |
| `PUT` | `/api/rutas/:id/ubicacion` | Actualizar ubicación actual *(admin/sucursal)* |

### API Gateway (utilidades)
| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/health` | Health check del gateway |
| `GET` | `/api/healthz` | Estado de salud de todos los microservicios |
| `GET` | `/api-docs` | Documentación Swagger de la API |

---

## Documentación adicional

- [`docs/requisitos.md`](docs/requisitos.md) — Requisitos funcionales y no funcionales.
- [`docs/guia-integracion-frontend.md`](docs/guia-integracion-frontend.md) — Guía de integración del frontend.
- [`docs/nfr-crypto-compatibilidad.md`](docs/nfr-crypto-compatibilidad.md) — Parche de compatibilidad de Web Crypto para Node.js v16.
