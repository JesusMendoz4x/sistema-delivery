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
// Usamos "pathRewrite: (path, req) => req.originalUrl" para evitar que Express recorte el prefijo
// de la ruta al enviarlo al microservicio correspondiente.

// Rutas de Sucursales
app.use('/api/sucursales', createProxyMiddleware({
    target: process.env.SUCURSALES_SERVICE_URL || 'http://localhost:3002',
    changeOrigin: true,
    pathRewrite: (path, req) => req.originalUrl,
    logLevel: 'debug'
}));

// Rutas de Productos e Inventario
app.use('/api/productos', createProxyMiddleware({
    target: process.env.INVENTARIO_SERVICE_URL || 'http://localhost:3001',
    changeOrigin: true,
    pathRewrite: (path, req) => req.originalUrl,
    logLevel: 'debug'
}));
app.use('/api/inventario', createProxyMiddleware({
    target: process.env.INVENTARIO_SERVICE_URL || 'http://localhost:3001',
    changeOrigin: true,
    pathRewrite: (path, req) => req.originalUrl,
    logLevel: 'debug'
}));

// Rutas de Pedidos
app.use('/api/pedidos', createProxyMiddleware({
    target: process.env.PEDIDOS_SERVICE_URL || 'http://localhost:3003',
    changeOrigin: true,
    pathRewrite: (path, req) => req.originalUrl,
    logLevel: 'debug'
}));

// Rutas de Repartidores
app.use('/api/repartidores', createProxyMiddleware({
    target: process.env.REPARTIDORES_SERVICE_URL || 'http://localhost:3004',
    changeOrigin: true,
    pathRewrite: (path, req) => req.originalUrl,
    logLevel: 'debug'
}));

// Rutas de Usuarios / Autenticación
app.use('/api/usuarios', createProxyMiddleware({
    target: process.env.USUARIO_SERVICE_URL || 'http://localhost:3005',
    changeOrigin: true,
    pathRewrite: (path, req) => req.originalUrl,
    logLevel: 'debug'
}));

// Rutas de Enrutamiento Inteligente
app.use('/api/enrutamiento', createProxyMiddleware({
    target: process.env.ENRUTAMIENTO_SERVICE_URL || 'http://localhost:3006',
    changeOrigin: true,
    pathRewrite: (path, req) => req.originalUrl,
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
