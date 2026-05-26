const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

// 1. Middleware de logs simple para auditoría en consola
app.use((req, res, next) => {
    console.log(`[API Gateway] ${req.method} ${req.url} -> Redirigiendo...`);
    next();
});

// 2. Configuración de CORS habilitando el frontend
app.use(cors({
    origin: [
        'http://localhost:5173', 'http://127.0.0.1:5173',
        'http://localhost:5174', 'http://127.0.0.1:5174',
        'http://localhost:5175', 'http://127.0.0.1:5175'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

// 3. Endpoint de salud para verificación del Gateway
app.get('/health', (req, res) => {
    res.json({
        ok: true,
        service: 'api-gateway',
        status: 'running',
        timestamp: new Date()
    });
});

// 4. Redireccionamiento dinámico mediante Proxy (http-proxy-middleware)
// En la versión ^4.0.0 instalada, todas las configuraciones del proxy (incluido el filtro)
// deben especificarse dentro de un único objeto de opciones usando la propiedad "pathFilter".
// Esto evita que Express recorte la ruta y permite que el proxy funcione impecablemente en la raíz.

// Rutas de Sucursales
app.use(createProxyMiddleware({
    pathFilter: '/api/sucursales',
    target: process.env.SUCURSALES_SERVICE_URL || 'http://localhost:3002',
    changeOrigin: true,
    logLevel: 'debug'
}));

// Rutas de Productos (Traduce /api/productos -> /api/inventario)
app.use(createProxyMiddleware({
    pathFilter: '/api/productos',
    target: process.env.INVENTARIO_SERVICE_URL || 'http://localhost:3001',
    changeOrigin: true,
    pathRewrite: {
        '^/api/productos': '/api/inventario'
    },
    logLevel: 'debug'
}));

// Rutas de Inventario
app.use(createProxyMiddleware({
    pathFilter: '/api/inventario',
    target: process.env.INVENTARIO_SERVICE_URL || 'http://localhost:3001',
    changeOrigin: true,
    logLevel: 'debug'
}));

// Rutas de Pedidos
app.use(createProxyMiddleware({
    pathFilter: '/api/pedidos',
    target: process.env.PEDIDOS_SERVICE_URL || 'http://localhost:3003',
    changeOrigin: true,
    logLevel: 'debug'
}));

// Rutas de Repartidores
app.use(createProxyMiddleware({
    pathFilter: '/api/repartidores',
    target: process.env.REPARTIDORES_SERVICE_URL || 'http://localhost:3004',
    changeOrigin: true,
    logLevel: 'debug'
}));

// Rutas de Usuarios / Autenticación
app.use(createProxyMiddleware({
    pathFilter: '/api/usuarios',
    target: process.env.USUARIO_SERVICE_URL || 'http://localhost:3005',
    changeOrigin: true,
    logLevel: 'debug'
}));

// Rutas de Enrutamiento Inteligente
app.use(createProxyMiddleware({
    pathFilter: '/api/enrutamiento',
    target: process.env.ENRUTAMIENTO_SERVICE_URL || 'http://localhost:3006',
    changeOrigin: true,
    logLevel: 'debug'
}));

// Middleware para capturar rutas no encontradas a través del Gateway
app.use((req, res) => {
    res.status(404).json({
        ok: false,
        message: `La ruta o servicio solicitado (${req.originalUrl}) no está disponible en el API Gateway.`
    });
});

module.exports = app;
