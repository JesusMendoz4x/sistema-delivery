# Requisitos del Sistema Delivery

Este documento describe los **requisitos funcionales (RF)** y **no funcionales (RNF)** del Sistema Delivery multisucursal. Fueron derivados del análisis del código fuente real del proyecto (microservicios backend, API Gateway y frontend).

---

## Requisitos Funcionales

### Gestión de usuarios y autenticación
- **RF-01** El sistema permite el registro de clientes en línea (nombre, email, teléfono, dirección y contraseña).
- **RF-02** El sistema permite iniciar sesión con email y contraseña, devolviendo un token JWT (expira en 8 horas).
- **RF-03** El sistema maneja tres roles con permisos diferenciados: `cliente`, `admin` y `sucursal`.
- **RF-04** El administrador puede crear, editar, activar y desactivar usuarios (baja lógica, no física).
- **RF-05** Un usuario solo puede modificar su propio perfil, salvo que tenga rol de administrador.

### Catálogo y productos
- **RF-06** El sistema permite la gestión del catálogo de productos (CRUD) con nombre, descripción, precio, categoría, ícono, imagen y marca de "destacado".
- **RF-07** El sistema soporta la carga de imágenes de producto (máximo 5 MB, solo archivos de imagen).
- **RF-08** Los clientes pueden navegar el menú filtrado por categorías.

### Inventario
- **RF-09** El sistema gestiona stock de forma independiente por sucursal.
- **RF-10** El sistema permite inicializar y actualizar el stock de cada producto por sucursal.
- **RF-11** El sistema valida y descuenta el stock de forma atómica al crear un pedido: si falta stock de algún producto, se cancela la operación completa.
- **RF-12** El sistema muestra alertas de nivel de stock (crítico, bajo, óptimo).

### Sucursales
- **RF-13** El sistema permite la gestión de sucursales (CRUD) con dirección, coordenadas geográficas (latitud/longitud) y capacidad operativa.
- **RF-14** El sistema solo lista sucursales activas; la eliminación es lógica (soft-delete).

### Pedidos
- **RF-15** El cliente puede crear un pedido con productos, cantidades, dirección de entrega, coordenadas y método de pago (efectivo/tarjeta).
- **RF-16** El sistema asigna automáticamente la sucursal más cercana según las coordenadas del cliente (algoritmo de Haversine).
- **RF-17** El sistema gestiona el ciclo de vida del pedido con los estados: `pendiente`, `preparando`, `en_camino`, `entregado` y `cancelado`.
- **RF-18** El sistema simula automáticamente las transiciones de estado del pedido en segundo plano.
- **RF-19** El administrador puede cambiar manualmente el estado de un pedido y asignar un repartidor.
- **RF-20** El sistema provee métricas para el dashboard: total de pedidos, ingresos del día y usuarios activos.

### Repartidores
- **RF-21** El sistema permite la gestión de repartidores (CRUD) con tipo de vehículo, placa, ubicación y capacidad operativa.
- **RF-22** El sistema asigna automáticamente un repartidor disponible al pedido mediante asignación atómica (evita condiciones de carrera).
- **RF-23** El sistema libera al repartidor (vuelve a estado `disponible`) al completarse la entrega.

### Enrutamiento
- **RF-24** El sistema calcula la sucursal más cercana y el tiempo estimado de entrega (mínimo 15 minutos, 2 minutos por km).
- **RF-25** El sistema gestiona rutas de entrega con estados (`asignada`, `en_curso`, `completada`, `cancelada`) y seguimiento de ubicación.

### Tiempo real
- **RF-26** El sistema notifica en tiempo real (vía WebSocket/Socket.IO) los cambios de estado de los pedidos al cliente y al panel de administración.

---

## Requisitos No Funcionales

### Arquitectura
- **RNF-01 (Modularidad)** Arquitectura de microservicios independientes, cada uno con su propia base de datos (patrón *Database per Service*).
- **RNF-02 (Punto único de entrada)** Todas las peticiones pasan por un API Gateway que enruta, autentica y aplica control de acceso.

### Seguridad
- **RNF-03** Las contraseñas se cifran con bcrypt (salt 10); nunca se almacenan en texto plano.
- **RNF-04** Autenticación basada en JWT con control de acceso por roles (RBAC) en el gateway.
- **RNF-05 (Rate limiting)** El gateway limita las peticiones por IP para mitigar abuso.

### Confiabilidad y resiliencia
- **RNF-06 (Tolerancia a fallos)** Las llamadas entre servicios usan reintentos y degradación elegante (*fallbacks* razonables si un servicio no responde), evitando fallos en cascada.
- **RNF-07 (Recuperación)** Al reiniciar, el servicio de pedidos reanuda los pedidos pendientes/en proceso desde la base de datos.
- **RNF-08** Los contenedores se reinician automáticamente (`restart: always`).

### Observabilidad
- **RNF-09 (Trazabilidad)** Propagación de un identificador de correlación (`x-correlation-id`) en todas las llamadas inter-servicio para rastreo distribuido.
- **RNF-10 (Health checks)** Cada servicio expone un endpoint `/health` y el gateway un `/api/healthz` con el estado global del ecosistema.
- **RNF-11 (Documentación)** La API está documentada con Swagger (`/api-docs`).

### Compatibilidad y portabilidad
- **RNF-12** Todo el sistema es dockerizado y orquestable con Docker Compose sobre una red interna.
- **RNF-13 (Compatibilidad Node 16)** Cada microservicio que conecta a MongoDB incluye un *polyfill* de Web Crypto para operar de forma estable en Node.js v16 (ver `docs/nfr-crypto-compatibilidad.md`).

### Usabilidad y frontend
- **RNF-14** Interfaz responsiva con tema oscuro construida con Tailwind CSS.
- **RNF-15** Persistencia de sesión en el cliente vía `localStorage` (sobrevive recargas de página).
- **RNF-16** Actualizaciones de la interfaz impulsadas por eventos WebSocket (sin *polling*).

### Mantenibilidad
- **RNF-17** Configuración mediante variables de entorno (puertos, URIs de base de datos, URLs de servicios, secreto JWT).
- **RNF-18** El frontend se sirve en producción mediante Nginx.

---

## Notas

- El secreto JWT se configura con la variable `JWT_SECRET`; existe un valor por defecto solo para desarrollo que **debe** reemplazarse en producción.
- Existe una inconsistencia de nomenclatura entre servicios: `inventario-service` lee `MONGODB_URI` mientras el resto de servicios lee `MONGO_URI`. Ver `.env.example`.
