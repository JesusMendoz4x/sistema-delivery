const Pedido = require('../models/Pedido');
const { verificarRepartidor, asignarRepartidorDisponible } = require('../services/repartidoresClient');
const { crearRuta, obtenerSucursalMasCercana } = require('../services/enrutamientoClient');
const { validarYDescontarStock } = require('../services/inventarioClient');
const axios = require('axios');

const API_GATEWAY_URL = process.env.API_GATEWAY_URL || 'http://api-gateway:5000';

const notificarCambioEstado = async (pedidoId, datos) => {
    try {
        console.log(`[Pedidos] Notificando cambio de estado para pedido ${pedidoId} al API Gateway...`);
        await axios.post(`${API_GATEWAY_URL}/api-internal/pedido-update`, {
            pedidoId,
            ...datos
        }, { timeout: 1500 });
    } catch (error) {
        console.warn(`[Pedidos] Advertencia: No se pudo notificar cambio de estado a través de WebSockets: ${error.message}`);
    }
};

const resuscitarSimulacion = async (pedido, correlationId = 'N/A', debeNotificarEnCamino = true) => {
    try {
        const pedidoId = pedido._id;
        const estado = pedido.estado;
        const repartidorId = pedido.repartidorId;

        console.log(`[Pedidos Simulator] [Pedido: ${pedidoId}] Resucitando simulación (Estado: ${estado}, Repartidor: ${repartidorId}, debeNotificar: ${debeNotificarEnCamino})`);

        if (estado === 'pendiente') {
            console.log(`[Pedidos Simulator] [Pedido: ${pedidoId}] Iniciando bucle de asignación de repartidor cada 30 segundos...`);
            const intervalId = setInterval(async () => {
                try {
                    const pedidoActual = await Pedido.findById(pedidoId);
                    if (!pedidoActual) {
                        console.log(`[Pedidos Simulator] [Pedido: ${pedidoId}] El pedido fue eliminado. Deteniendo bucle.`);
                        clearInterval(intervalId);
                        return;
                    }
                    if (pedidoActual.estado !== 'pendiente') {
                        console.log(`[Pedidos Simulator] [Pedido: ${pedidoId}] El pedido ya no está en estado 'pendiente' (Estado actual: ${pedidoActual.estado}). Deteniendo bucle.`);
                        clearInterval(intervalId);
                        return;
                    }

                    console.log(`[Pedidos Simulator] [Pedido: ${pedidoId}] Reintentando asignar repartidor en bucle...`);
                    const reintentoRepartidor = await asignarRepartidorDisponible(correlationId);
                    if (reintentoRepartidor && reintentoRepartidor.repartidor) {
                        const currentRepartidorId = reintentoRepartidor.repartidor._id;
                        console.log(`[Pedidos Simulator] [Pedido: ${pedidoId}] Repartidor asignado con éxito: ${reintentoRepartidor.repartidor.nombre}`);
                        clearInterval(intervalId);

                        const pedidoActualizado = await Pedido.findByIdAndUpdate(
                            pedidoId,
                            { estado: 'en_camino', repartidorId: currentRepartidorId },
                            { new: true }
                        );

                        resuscitarSimulacion(pedidoActualizado, correlationId, true);
                    } else {
                        console.log(`[Pedidos Simulator] [Pedido: ${pedidoId}] Sigue sin haber repartidores disponibles. Se reintentará en 30 segundos.`);
                    }
                } catch (err) {
                    console.error(`[Pedidos Simulator] [Pedido: ${pedidoId}] Error durante el reintento de asignación:`, err.message);
                }
            }, 30000);
        } 
        else if (estado === 'preparando') {
            const tiempoTranscurrido = Date.now() - new Date(pedido.updatedAt).getTime();
            const delay = Math.max(0, 15000 - tiempoTranscurrido);
            console.log(`[Pedidos Simulator] [Pedido: ${pedidoId}] En preparación. Programando transición a 'en_camino' en ${delay}ms...`);

            setTimeout(async () => {
                try {
                    const pedidoActual = await Pedido.findById(pedidoId);
                    if (!pedidoActual || pedidoActual.estado !== 'preparando') {
                        console.log(`[Pedidos Simulator] [Pedido: ${pedidoId}] El pedido ya no está en estado 'preparando'. Cancelando transición.`);
                        return;
                    }

                    console.log(`\n[Pedidos Simulator] [Pedido: ${pedidoId}] Progresando a estado 'en_camino'...`);
                    const pedidoEnRuta = await Pedido.findByIdAndUpdate(
                        pedidoId,
                        { estado: 'en_camino' },
                        { new: true }
                    );

                    resuscitarSimulacion(pedidoEnRuta, correlationId, true);
                } catch (err) {
                    console.error(`[Pedidos Simulator] [Pedido: ${pedidoId}] Error al transicionar de 'preparando' a 'en_camino':`, err.message);
                }
            }, delay);
        } 
        else if (estado === 'en_camino') {
            const tiempoTranscurrido = Date.now() - new Date(pedido.updatedAt).getTime();
            const delay = Math.max(0, 30000 - tiempoTranscurrido);
            console.log(`[Pedidos Simulator] [Pedido: ${pedidoId}] En camino. Programando entrega en ${delay}ms...`);

            if (debeNotificarEnCamino) {
                try {
                    console.log(`[Pedidos Simulator] [Pedido: ${pedidoId}] Asegurando ruta para el repartidor ${repartidorId}...`);
                    const infoRuta = await crearRuta(pedidoId, repartidorId, correlationId);
                    await notificarCambioEstado(pedidoId, {
                        estado: 'en_camino',
                        repartidorId,
                        ruta: infoRuta
                    });
                } catch (err) {
                    console.warn(`[Pedidos Simulator] [Pedido: ${pedidoId}] Advertencia al crear ruta:`, err.message);
                }
            }

            setTimeout(async () => {
                try {
                    const pedidoActual = await Pedido.findById(pedidoId);
                    if (!pedidoActual || pedidoActual.estado !== 'en_camino') {
                        console.log(`[Pedidos Simulator] [Pedido: ${pedidoId}] El pedido ya no está en estado 'en_camino'. Cancelando entrega.`);
                        return;
                    }

                    console.log(`\n[Pedidos Simulator] [Pedido: ${pedidoId}] Progresando a estado 'entregado'...`);
                    await Pedido.findByIdAndUpdate(
                        pedidoId,
                        { estado: 'entregado' },
                        { new: true }
                    );

                    try {
                        console.log(`[Pedidos Simulator] Liberando repartidor ${repartidorId} en repartidores-service...`);
                        const REPARTIDORES_SERVICE_URL = process.env.REPARTIDORES_SERVICE_URL || 'http://localhost:3004';
                        await axios.put(`${REPARTIDORES_SERVICE_URL}/api/repartidores/${repartidorId}/activar`, {}, {
                            headers: { 'x-correlation-id': correlationId || 'N/A' },
                            timeout: 2000
                        });
                        console.log(`[Pedidos Simulator] Repartidor ${repartidorId} liberado y listo para nuevos pedidos.`);
                    } catch (err) {
                        console.warn(`[Pedidos Simulator] Advertencia al liberar repartidor: ${err.message}`);
                    }

                    await notificarCambioEstado(pedidoId, {
                        estado: 'entregado',
                        repartidorId
                    });
                } catch (err) {
                    console.error(`[Pedidos Simulator] [Pedido: ${pedidoId}] Error al transicionar a 'entregado':`, err.message);
                }
            }, delay);
        }
    } catch (error) {
        console.error(`[Pedidos Simulator] Error general en resuscitarSimulacion para pedido ${pedido?._id}:`, error.message);
    }
};

exports.crearPedido = async (req, res) => {
    try {
        const { clienteId, productos, total, direccionEntrega, metodoPago } = req.body;
        const correlationId = req.correlationId || 'N/A';

        console.log(`[Pedidos Orquestador] [Correlation-ID: ${correlationId}] Iniciando flujo de orquestación...`);

        // Extraer coordenadas con fallbacks muy robustos de formato
        const latitud = req.body.latitud !== undefined ? req.body.latitud : (req.body.ubicacion?.latitud || req.body.direccionEntrega?.ubicacion?.latitud);
        const longitud = req.body.longitud !== undefined ? req.body.longitud : (req.body.ubicacion?.longitud || req.body.direccionEntrega?.ubicacion?.longitud);

        // ==========================================
        // PASO 1: ENRUTAMIENTO INTELIGENTE
        // ==========================================
        let sucursalAsignada = '6650dbf7f1a0b1234567890a'; // ID Semilla: Sucursal Centro por defecto
        let tiempoEstimado = 20; // Por defecto
        let distancia = 5.0; // Por defecto

        if (latitud !== undefined && longitud !== undefined) {
            console.log(`[Pedidos Orquestador] [Correlation-ID: ${correlationId}] Solicitando sucursal más cercana para coordenadas: [${latitud}, ${longitud}]...`);
            const enrutamientoData = await obtenerSucursalMasCercana(latitud, longitud, correlationId);
            
            if (enrutamientoData && enrutamientoData.sucursalId) {
                sucursalAsignada = enrutamientoData.sucursalId;
                tiempoEstimado = enrutamientoData.tiempoEstimadoMinutos || tiempoEstimado;
                distancia = enrutamientoData.distanciaKm || distancia;
                console.log(`[Pedidos Orquestador] [Correlation-ID: ${correlationId}] Sucursal asignada dinámicamente: ${enrutamientoData.nombre} (${sucursalAsignada})`);
            }
        } else {
            console.log(`[Pedidos Orquestador] [Correlation-ID: ${correlationId}] Coordenadas no proporcionadas, asignando sucursal Centro por defecto.`);
        }

        // ==========================================
        // PASO 2: VALIDACIÓN Y DESCUENTO DE STOCK EN INVENTARIO
        // ==========================================
        console.log(`[Pedidos Orquestador] [Correlation-ID: ${correlationId}] Validando y descontando existencias en sucursal: ${sucursalAsignada}...`);
        
        // Mapear carrito al formato esperado [{ productoId, cantidad }]
        const productosCarrito = productos.map(p => ({
            productoId: p.productoId,
            cantidad: p.cantidad
        }));

        const inventarioRespuesta = await validarYDescontarStock(sucursalAsignada, productosCarrito, correlationId);

        // Si la respuesta del inventario falló explícitamente (sin stock), cancelamos
        if (inventarioRespuesta && inventarioRespuesta.ok === false) {
            console.warn(`[Pedidos Orquestador] [Correlation-ID: ${correlationId}] Falló verificación de stock: ${inventarioRespuesta.message}`);
            return res.status(400).json({
                ok: false,
                message: inventarioRespuesta.message || 'Existencias insuficientes para procesar la orden en esta sucursal.',
                detalles: inventarioRespuesta.sinStock || []
            });
        }

        // ==========================================
        // PASO 3: ASIGNACIÓN AUTOMÁTICA DE REPARTIDOR
        // ==========================================
        console.log(`[Pedidos Orquestador] [Correlation-ID: ${correlationId}] Solicitando repartidor disponible...`);
        const asignacionRepartidor = await asignarRepartidorDisponible(correlationId);
        
        let repartidorAsignadoId = null;
        let estadoInicial = 'pendiente';

        if (asignacionRepartidor && asignacionRepartidor.repartidor) {
            repartidorAsignadoId = asignacionRepartidor.repartidor._id;
            estadoInicial = 'preparando';
            console.log(`[Pedidos Orquestador] [Correlation-ID: ${correlationId}] Repartidor asignado: ${asignacionRepartidor.repartidor.nombre} (${repartidorAsignadoId})`);
        } else {
            console.log(`[Pedidos Orquestador] [Correlation-ID: ${correlationId}] No hay repartidores disponibles, el pedido quedará pendiente.`);
        }

        // ==========================================
        // PASO 4: CREACIÓN Y GUARDADO DE PEDIDO consolidado
        // ==========================================
        // Si direccionEntrega viene como objeto, lo serializamos a String para Mongoose
        const direccionTexto = typeof direccionEntrega === 'object' 
            ? (direccionEntrega.calle || JSON.stringify(direccionEntrega)) 
            : direccionEntrega;

        const nuevoPedido = new Pedido({
            clienteId,
            sucursalId: sucursalAsignada,
            repartidorId: repartidorAsignadoId,
            productos,
            total,
            direccionEntrega: direccionTexto,
            metodoPago: metodoPago || 'efectivo',
            estado: estadoInicial
        });

        await nuevoPedido.save();
        console.log(`[Pedidos Orquestador] [Correlation-ID: ${correlationId}] Pedido ${nuevoPedido._id} creado con éxito y guardado en DB.`);

        // Responder inmediatamente al cliente
        res.status(201).json(nuevoPedido);

        // Notificar la creación en tiempo real a los administradores
        notificarCambioEstado(nuevoPedido._id, { nuevoPedido });

        // ==========================================
        // PASO 5: MÁQUINA DE ESTADOS EN SEGUNDO PLANO (WS SIMULADOR)
        // ==========================================
        resuscitarSimulacion(nuevoPedido, correlationId);

    } catch (error) {
        console.error(`[Pedidos Orquestador] Error al procesar pedido: ${error.message}`);
        res.status(500).json({ message: 'Error interno en la creación del pedido', error: error.message });
    }
};


exports.listarPedidos = async (req, res) => {
    try {
        const pedidos = await Pedido.find().sort({ createdAt: -1 });
        res.json(pedidos);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los pedidos', error: error.message });
    }
}

exports.obtenerPedidoPorId = async (req, res) => {
    try {
        const pedido = await Pedido.findById(req.params.id);
        if (!pedido) {
            return res.status(404).json({ message: 'Pedido no encontrado' });
        }
        res.json(pedido);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el pedido', error: error.message });
    }
}

exports.actualizarEstadoPedido = async (req, res) => {
    try {
        const { estado } = req.body;
        const pedido = await Pedido.findByIdAndUpdate(
            req.params.id, 
            { estado }, 
            { new: true, runValidators: true }
        );
        if (!pedido) {
            return res.status(404).json({ message: 'Pedido no encontrado' });
        }
        
        // Notificar en segundo plano (no bloquea la respuesta HTTP)
        notificarCambioEstado(pedido._id, { estado: pedido.estado, repartidorId: pedido.repartidorId });
        
        res.json(pedido);
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el estado del pedido', error: error.message });
    }
}

exports.asignarRepartidor = async (req, res) => {
    try {
        const { repartidorId } = req.body;

        // Primero verificamos que el pedido exista
        const pedidoExistente = await Pedido.findById(req.params.id);
        if (!pedidoExistente) {
            return res.status(404).json({ message: 'Pedido no encontrado' });
        }

        // 1. Verificar repartidor (Resiliente, con fallback de contingencia)
        console.log(`[Pedidos] [Correlation-ID: ${req.correlationId}] Solicitando verificación de repartidor ${repartidorId}...`);
        const infoRepartidor = await verificarRepartidor(repartidorId, req.correlationId);

        // 2. Calcular y registrar ruta (Resiliente, con fallback de contingencia)
        console.log(`[Pedidos] [Correlation-ID: ${req.correlationId}] Solicitando creación de ruta para pedido ${req.params.id} con repartidor ${repartidorId}...`);
        const infoRuta = await crearRuta(req.params.id, repartidorId, req.correlationId);

        // 3. Actualizar el pedido localmente
        const pedido = await Pedido.findByIdAndUpdate(
            req.params.id,
            { repartidorId, estado: 'en_camino' },
            { new: true, runValidators: true }
        );

        // Notificar en segundo plano al Gateway para emitir por WebSockets
        notificarCambioEstado(pedido._id, { 
            estado: pedido.estado, 
            repartidorId: pedido.repartidorId,
            ruta: infoRuta
        });

        // Registrar simulación de entrega para el pedido asignado manualmente
        resuscitarSimulacion(pedido, req.correlationId, false);

        res.json({
            message: 'Repartidor asignado con éxito',
            pedido,
            repartidor: infoRepartidor,
            ruta: infoRuta
        });
    } catch (error) {
        res.status(500).json({ message: 'Error al asignar repartidor', error: error.message });
    }
}


// Endpoint para métricas del dashboard (total pedidos, ingresos del día, usuarios activos)
exports.obtenerMetricasDashboard = async (req, res) => {
    try {
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);
        
        // Total histórico
        const totalPedidos = await Pedido.countDocuments();
        
        // Ingresos acumulados del día (pedidos entregados)
        const pedidosHoy = await Pedido.find({
            createdAt: { $gte: hoy },
            estado: 'entregado'
        });
        const ingresosDia = pedidosHoy.reduce((sum, p) => sum + p.total, 0);
        
        // Conteo de usuarios activos (se puede consultar sincrónicamente a usuario-service)
        let usuariosActivos = 0;
        try {
            const response = await axios.get(`${API_GATEWAY_URL}/api-internal/usuarios-activos`, { timeout: 2000 });
            usuariosActivos = response.data.usuariosActivos || 0;
        } catch (err) {
            console.warn(`[Pedidos] Advertencia al obtener usuarios activos: ${err.message}`);
        }
        // Si el servicio está aislado, retornamos el valor o un conteo simulado resiliente
        
        res.json({
            totalPedidos,
            ingresosDia,
            usuariosActivos: usuariosActivos
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Recuperación de desastres: busca pedidos activos al iniciar y reanuda sus simulaciones
exports.recuperarSimulacionesActivas = async () => {
    try {
        console.log('[Pedidos Simulator] Recuperando simulaciones activas para recuperación de desastres...');
        const pedidosActivos = await Pedido.find({
            estado: { $in: ['pendiente', 'preparando', 'en_camino'] }
        });
        
        console.log(`[Pedidos Simulator] Se encontraron ${pedidosActivos.length} pedidos activos para reanudar.`);
        
        for (const pedido of pedidosActivos) {
            const correlationId = `recovery-${pedido._id}-${Date.now()}`;
            resuscitarSimulacion(pedido, correlationId, true);
        }
    } catch (error) {
        console.error('[Pedidos Simulator] Error al recuperar simulaciones activas:', error.message);
    }
};
