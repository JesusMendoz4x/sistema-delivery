const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./docs/swagger.json');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const JWT_SECRET = process.env.JWT_SECRET || 'secreto_super_seguro_delivery';

// Middleware de verificación de JWT
const verifyJWT = (allowedRoles = []) => {
    return (req, res, next) => {
        // Permitir peticiones de tipo OPTIONS libres para preflight de CORS
        if (req.method === 'OPTIONS') {
            return next();
        }

        const authHeader = req.headers['authorization'];
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                ok: false,
                message: 'Acceso denegado. Token no proporcionado o formato incorrecto (debe ser Bearer <token>).'
            });
        }

        const token = authHeader.split(' ')[1];
        try {
            const decoded = jwt.verify(token, JWT_SECRET);
            req.user = decoded;

            if (allowedRoles.length > 0 && !allowedRoles.includes(decoded.rol)) {
                return res.status(403).json({
                    ok: false,
                    message: `Acceso prohibido. Se requiere rol de: [${allowedRoles.join(', ')}]. Tu rol es: ${decoded.rol}`
                });
            }

            next();
        } catch (error) {
            return res.status(401).json({
                ok: false,
                message: 'Acceso denegado. Token inválido o expirado.',
                error: error.message
            });
        }
    };
};

const app = express();

// A. Configuración de Helmet para seguridad de cabeceras HTTP
app.use(helmet({
    contentSecurityPolicy: false // Deshabilitamos CSP para evitar bloqueos en Swagger UI y Mapas de Google en iframe
}));

// B. Configuración de Rate Limiter para proteger las rutas /api/ de saturación
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 200, // Límite de 200 peticiones por IP
    message: {
        ok: false,
        message: 'Demasiadas peticiones desde esta IP. Por favor intente de nuevo en 15 minutos.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});
app.use('/api/', apiLimiter);

// 1. Middleware de Correlation ID y logs de auditoría en consola
const crypto = require('crypto');

app.use((req, res, next) => {
    const correlationId = req.headers['x-correlation-id'] || req.headers['X-Correlation-ID'] || crypto.randomUUID();
    req.correlationId = correlationId;
    req.headers['x-correlation-id'] = correlationId;
    res.setHeader('x-correlation-id', correlationId);

    console.log(`[API Gateway] [Correlation-ID: ${correlationId}] ${req.method} ${req.url} -> Redirigiendo...`);
    next();
});

// 2. Configuración de CORS habilitando el frontend
app.use(cors({
    origin: [
        'http://localhost', 'http://127.0.0.1', // Puerto 80 del Frontend Dockerizado
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

// Limpiador de cabeceras CORS duplicadas de microservicios para evitar conflictos en el navegador
const cleanCorsHeaders = (proxyRes, req, res) => {
    delete proxyRes.headers['access-control-allow-origin'];
    delete proxyRes.headers['access-control-allow-credentials'];
    delete proxyRes.headers['access-control-allow-methods'];
    delete proxyRes.headers['access-control-allow-headers'];
};

// Rutas de Sucursales (GET público, otros Admin)
app.use('/api/sucursales', (req, res, next) => {
    if (req.method === 'GET') return next();
    return verifyJWT(['admin'])(req, res, next);
}, createProxyMiddleware({
    target: process.env.SUCURSALES_SERVICE_URL || 'http://localhost:3002',
    changeOrigin: true,
    logLevel: 'debug',
    onProxyRes: cleanCorsHeaders
}));

// Rutas de Productos (GET público, otros Admin/Sucursal)
app.use('/api/productos', (req, res, next) => {
    if (req.method === 'GET') return next();
    return verifyJWT(['admin', 'sucursal'])(req, res, next);
}, createProxyMiddleware({
    target: process.env.INVENTARIO_SERVICE_URL || 'http://localhost:3001',
    changeOrigin: true,
    pathRewrite: {
        '^/api/productos': '/api/inventario'
    },
    logLevel: 'debug',
    onProxyRes: cleanCorsHeaders
}));

// Rutas de Inventario (GET público, otros Admin/Sucursal)
app.use('/api/inventario', (req, res, next) => {
    if (req.method === 'GET') return next();
    return verifyJWT(['admin', 'sucursal'])(req, res, next);
}, createProxyMiddleware({
    target: process.env.INVENTARIO_SERVICE_URL || 'http://localhost:3001',
    changeOrigin: true,
    logLevel: 'debug',
    onProxyRes: cleanCorsHeaders
}));

// Rutas de Pedidos (Cualquier operación requiere autenticación)
app.use('/api/pedidos', verifyJWT(['cliente', 'admin', 'sucursal']), createProxyMiddleware({
    target: process.env.PEDIDOS_SERVICE_URL || 'http://localhost:3003',
    changeOrigin: true,
    logLevel: 'debug',
    onProxyRes: cleanCorsHeaders
}));

// Rutas de Repartidores (GET público para asignación, otros Admin)
app.use('/api/repartidores', (req, res, next) => {
    if (req.method === 'GET') return next();
    return verifyJWT(['admin'])(req, res, next);
}, createProxyMiddleware({
    target: process.env.REPARTIDORES_SERVICE_URL || 'http://localhost:3004',
    changeOrigin: true,
    logLevel: 'debug',
    onProxyRes: cleanCorsHeaders
}));

// Rutas de Usuarios / Autenticación
// POST /api/usuarios (registro) y POST /api/usuarios/login (login) son públicos.
app.use('/api/usuarios', (req, res, next) => {
    if (req.method === 'POST') {
        return next(); // login o registro son públicos
    }
    // Permitir a usuarios autenticados acceder a su propio perfil
    return verifyJWT(['admin', 'cliente', 'sucursal'])(req, res, (err) => {
        if (err) return next(err);
        
        // Si es admin, tiene acceso total e irrestricto
        if (req.user.rol === 'admin') {
            return next();
        }

        // Si no es admin, solo puede consultar o modificar su propio ID
        // req.path es relativo al mount path (ej: /6650dbf7f1a0b1234567890c)
        const idPath = req.path.split('/')[1];
        const userId = req.user.id || req.user._id;

        if (idPath && idPath === userId) {
            // El usuario autenticado solo puede hacer GET o PUT a su propio ID
            if (req.method === 'GET' || req.method === 'PUT') {
                return next();
            }
        }

        return res.status(403).json({
            ok: false,
            message: 'Acceso prohibido. No tienes permisos para consultar o modificar este perfil.'
        });
    });
}, createProxyMiddleware({
    target: process.env.USUARIO_SERVICE_URL || 'http://localhost:3005',
    changeOrigin: true,
    logLevel: 'debug',
    onProxyRes: cleanCorsHeaders
}));

// Rutas de Enrutamiento Inteligente (Requiere autenticación admin o sucursal)
app.use('/api/enrutamiento', verifyJWT(['admin', 'sucursal']), createProxyMiddleware({
    target: process.env.ENRUTAMIENTO_SERVICE_URL || 'http://localhost:3006',
    changeOrigin: true,
    logLevel: 'debug',
    onProxyRes: cleanCorsHeaders
}));

// Endpoint interno para recibir actualizaciones de pedidos desde el pedidos-service y emitirlas vía WebSockets
app.post('/api-internal/pedido-update', express.json(), (req, res) => {
    const { pedidoId, estado, repartidorId, ruta } = req.body;
    const io = req.app.get('io');
    if (io) {
        io.to(`pedido_${pedidoId}`).emit('pedido_actualizado', {
            pedidoId,
            estado,
            repartidorId,
            ruta
        });
        console.log(`[API Gateway] [WS] Evento emitido para pedido_${pedidoId}: estado=${estado}`);
        return res.json({ ok: true });
    }
    res.status(500).json({ ok: false, message: 'Servidor WebSocket no disponible' });
});

// Endpoint interno para consultar la cantidad de sockets conectados actualmente (usuarios activos en tiempo real)
app.get('/api-internal/usuarios-activos', (req, res) => {
    const io = req.app.get('io');
    const conteo = io ? io.sockets.sockets.size : 0;
    res.json({ usuariosActivos: conteo });
});

// Middleware para capturar rutas no encontradas a través del Gateway
app.use((req, res) => {
    res.status(404).json({
        ok: false,
        message: `La ruta o servicio solicitado (${req.originalUrl}) no está disponible en el API Gateway.`
    });
});

module.exports = app;
