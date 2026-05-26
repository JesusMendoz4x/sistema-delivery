const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./docs/swagger.json');
const axios = require('axios');

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

// 3.5. Configuración de Swagger UI centralizado para OpenAPI/Swagger docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// 3.6. Endpoint unificado de salud del sistema (Health Dashboard)
app.get('/api/healthz', async (req, res) => {
    const services = {
        'inventario-service': process.env.INVENTARIO_SERVICE_URL || 'http://localhost:3001',
        'sucursales-service': process.env.SUCURSALES_SERVICE_URL || 'http://localhost:3002',
        'pedidos-service': process.env.PEDIDOS_SERVICE_URL || 'http://localhost:3003',
        'repartidores-service': process.env.REPARTIDORES_SERVICE_URL || 'http://localhost:3004',
        'usuario-service': process.env.USUARIO_SERVICE_URL || 'http://localhost:3005',
        'enrutamiento-service': process.env.ENRUTAMIENTO_SERVICE_URL || 'http://localhost:3006'
    };

    const healthStatus = {};
    let systemOverallStatus = 'online';

    // Generar promesas de salud para cada microservicio en paralelo
    const promises = Object.entries(services).map(async ([name, baseUrl]) => {
        // sucursales-service expone /api/health, los demás /health
        const healthUrl = name === 'sucursales-service' 
            ? `${baseUrl}/api/health` 
            : `${baseUrl}/health`;

        try {
            const start = Date.now();
            const response = await axios.get(healthUrl, { timeout: 1500 });
            const responseTime = Date.now() - start;

            healthStatus[name] = {
                status: 'online',
                responseTimeMs: responseTime,
                url: healthUrl,
                details: response.data
            };
        } catch (error) {
            healthStatus[name] = {
                status: 'offline',
                url: healthUrl,
                error: error.message
            };
            systemOverallStatus = 'degraded';
        }
    });

    await Promise.allSettled(promises);

    // Si todos los microservicios están caídos, marcamos como offline global
    const allOffline = Object.values(healthStatus).every(s => s.status === 'offline');
    if (allOffline && Object.keys(services).length > 0) {
        systemOverallStatus = 'offline';
    }

    res.json({
        status: systemOverallStatus,
        timestamp: new Date(),
        gateway: {
            status: 'online',
            service: 'api-gateway'
        },
        services: healthStatus
    });
});

// 4. Redireccionamiento dinámico mediante Proxy (http-proxy-middleware v2.x)
// Pasamos el filtro de ruta como primer argumento de "createProxyMiddleware".
// Esto evita que Express recorte el prefijo y permite la reescritura fluida de rutas de forma nativa.

// Rutas de Sucursales
app.use(createProxyMiddleware('/api/sucursales', {
    target: process.env.SUCURSALES_SERVICE_URL || 'http://localhost:3002',
    changeOrigin: true,
    logLevel: 'debug'
}));

// Rutas de Productos (Traduce /api/productos -> /api/inventario)
app.use(createProxyMiddleware('/api/productos', {
    target: process.env.INVENTARIO_SERVICE_URL || 'http://localhost:3001',
    changeOrigin: true,
    pathRewrite: {
        '^/api/productos': '/api/inventario'
    },
    logLevel: 'debug'
}));

// Rutas de Inventario
app.use(createProxyMiddleware('/api/inventario', {
    target: process.env.INVENTARIO_SERVICE_URL || 'http://localhost:3001',
    changeOrigin: true,
    logLevel: 'debug'
}));

// Rutas de Pedidos
app.use(createProxyMiddleware('/api/pedidos', {
    target: process.env.PEDIDOS_SERVICE_URL || 'http://localhost:3003',
    changeOrigin: true,
    logLevel: 'debug'
}));

// Rutas de Repartidores
app.use(createProxyMiddleware('/api/repartidores', {
    target: process.env.REPARTIDORES_SERVICE_URL || 'http://localhost:3004',
    changeOrigin: true,
    logLevel: 'debug'
}));

// Rutas de Usuarios / Autenticación
app.use(createProxyMiddleware('/api/usuarios', {
    target: process.env.USUARIO_SERVICE_URL || 'http://localhost:3005',
    changeOrigin: true,
    logLevel: 'debug'
}));

// Rutas de Enrutamiento Inteligente
app.use(createProxyMiddleware('/api/enrutamiento', {
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
