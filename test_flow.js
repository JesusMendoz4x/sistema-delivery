async function runTest() {
    console.log("\n=======================================================");
    console.log(" INICIANDO PRUEBA DE FLUJO DE PEDIDO ORQUESTRADO ");
    console.log("=======================================================\n");
    
    try {
        // 1. Login en el Gateway para obtener el token JWT de cliente
        console.log("[1/4] Iniciando sesión como cliente de prueba...");
        const loginRes = await fetch("http://localhost:5000/api/usuarios/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: "juan@delivery.com", password: "clientepassword" })
        });
        const loginData = await loginRes.json();
        
        if (!loginData.ok || !loginData.token) {
            console.error("❌ Error al iniciar sesión:", loginData);
            return;
        }
        
        const token = loginData.token;
        const clienteId = loginData.usuario.id;
        console.log(` ✅ Login exitoso. Cliente: ${loginData.usuario.nombre} (${clienteId})`);
        console.log(`    Token obtenido correctamente.`);

        // 2. Obtener productos para agarrar el primero del catálogo
        console.log("\n[2/4] Obteniendo catálogo de productos activos...");
        const prodRes = await fetch("http://localhost:5000/api/productos");
        const productos = await prodRes.json();
        
        if (!productos || productos.length === 0) {
            console.error("❌ No hay productos en el catálogo maestro.");
            return;
        }
        
        const productoTest = productos[0];
        console.log(` ✅ Producto seleccionado: ${productoTest.nombre}`);
        console.log(`    ID: ${productoTest._id} | Precio: $${productoTest.precio}`);

        // 3. Crear pedido orquestado enviando coordenadas del cliente (cerca de Sucursal Centro)
        console.log("\n[3/4] Enviando petición de compra orquestada al Gateway...");
        const orderRes = await fetch("http://localhost:5000/api/pedidos", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                clienteId: clienteId,
                productos: [
                    {
                        productoId: productoTest._id,
                        nombre: productoTest.nombre,
                        precioUnitario: productoTest.precio,
                        cantidad: 2
                    }
                ],
                total: productoTest.precio * 2,
                direccionEntrega: "Macedonio Alcalá 402, Centro, Oaxaca",
                latitud: 17.0600, // Cerca del Centro de Oaxaca (lat 17.0604, lon -96.7266)
                longitud: -96.7260,
                metodoPago: "tarjeta"
            })
        });
        const orderData = await orderRes.json();
        
        if (orderData.message && !orderData._id) {
            console.error("❌ Error al crear el pedido orquestado:", orderData);
            return;
        }

        console.log("\n=======================================================");
        console.log(" 🎉 ¡PEDIDO ORQUESTRADO CREADO EXITOSAMENTE! ");
        console.log("=======================================================");
        console.log(` ID Pedido:   ${orderData._id}`);
        console.log(` Sucursal:    ${orderData.sucursalId} (Asignada dinámicamente)`);
        console.log(` Repartidor:  ${orderData.repartidorId || "Ninguno"}`);
        console.log(` Estado:      ${orderData.estado}`);
        console.log(` Total:       $${orderData.total}`);
        console.log("=======================================================\n");
        
        const pedidoId = orderData._id;

        // 4. Polling para monitorear el progreso del simulador
        console.log("=== MONITOREANDO CAMBIOS DE ESTADO (MÁQUINA DE ESTADOS) ===");
        
        const checarEstado = async (segundos) => {
            const res = await fetch(`http://localhost:5000/api/pedidos/${pedidoId}`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const data = await res.json();
            console.log(`\n[T + ${segundos}s] Estado: '${data.estado}' | Conductor ID: ${data.repartidorId || "Sin asignar"}`);
        };

        // Monitorear a los 5 segundos (debe estar en 'preparando')
        console.log(" Esperando 5 segundos...");
        await new Promise(r => setTimeout(r, 5000));
        await checarEstado(5);

        // Monitorear a los 20 segundos (debe pasar a 'en_camino' a los 15s)
        console.log("\n Esperando 15 segundos más (Tránsito)...");
        await new Promise(r => setTimeout(r, 15000));
        await checarEstado(20);

        // Monitorear a los 50 segundos (debe pasar a 'entregado' a los 45s)
        console.log("\n Esperando 30 segundos más (Entrega final)...");
        await new Promise(r => setTimeout(r, 30000));
        await checarEstado(50);
        
        console.log("\n=======================================================");
        console.log(" ✅ PRUEBA DE ORQUESTRACIÓN FINALIZADA CON ÉXITO ");
        console.log("=======================================================\n");

    } catch (error) {
        console.error("❌ ERROR DURANTE LA PRUEBA:", error.message);
    }
}

runTest();
