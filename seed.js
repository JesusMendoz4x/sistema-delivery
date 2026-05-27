const mongoose = require('mongoose');

const mongoHost = 'mongodb://127.0.0.1:27017';

// Datos de prueba basados en el MenuGrid.jsx del frontend
const productosSeed = [
  {
    nombre: "Gyoza de Wagyu",
    descripcion: "Selladas al vacío y terminadas al fuego con reducción de soja añeja y cebollino fino.",
    categoria: "Entradas",
    precio: 24.00,
    disponible: true
  },
  {
    nombre: "Tartar de Atún Rojo",
    descripcion: "Atún Bluefin con emulsión de chile serrano, aguacate y perlas de yuzu.",
    categoria: "Entradas",
    precio: 32.00,
    disponible: true
  },
  {
    nombre: "Rock Shrimp Tempura",
    descripcion: "Camarones de roca en tempura ligera con mayonesa de sriracha casera.",
    categoria: "Entradas",
    precio: 28.00,
    disponible: true
  },
  {
    nombre: "Roll Oaxaca-Maki",
    descripcion: "Roll de cangrejo real, aguacate y chapulín tostado con mayonesa de mole negro.",
    categoria: "Sushi & Sashimi",
    precio: 29.00,
    disponible: true
  },
  {
    nombre: "Xiao Long Bao",
    descripcion: "Bolsas de masa fina rellenas de cerdo y caldo concentrado de jengibre.",
    categoria: "Dumplings",
    precio: 26.00,
    disponible: true
  },
  {
    nombre: "Ramen de Mole",
    descripcion: "Caldo de pollo 12 horas infusionado con mole negro oaxaqueño, chashu y huevo marinado.",
    categoria: "Especialidades",
    precio: 52.00,
    disponible: true
  },
  {
    nombre: "Mochi de Chocolate Oaxaqueño",
    descripcion: "Mochi artesanal relleno de ganache de cacao 70% con sal de mar y polvo de matcha.",
    categoria: "Postres",
    precio: 16.00,
    disponible: true
  }
];

async function seed() {
    try {
        console.log('==================================================');
        console.log(' INICIANDO PROCESO DE SEMILLA (DATABASE SEEDING) ');
        console.log('==================================================\n');

        // --- 1. SEED DE USUARIOS ---
        console.log('[1/5] Conectando a base de datos de Usuarios...');
        const userConn = await mongoose.createConnection(`${mongoHost}/usuariosdb`).asPromise();
        
        const UsuarioSchema = new mongoose.Schema({
            nombre: String,
            email: { type: String, unique: true },
            password: { type: String, required: true },
            telefono: String,
            direccion: String,
            rol: String,
            estado: { type: String, default: 'activo' }
        });
        const UsuarioModel = userConn.model('Usuario', UsuarioSchema);
        
        await UsuarioModel.deleteMany({});
        console.log(' Limpiados usuarios previos.');

        // Crear Admin y Cliente
        const adminUser = await UsuarioModel.create({
            nombre: 'Administrador Principal',
            email: 'admin@delivery.com',
            password: 'adminpassword',
            telefono: '9511234567',
            direccion: 'Centro, Oaxaca',
            rol: 'admin',
            estado: 'activo'
        });
        const clientUser = await UsuarioModel.create({
            nombre: 'Juan Pérez',
            email: 'juan@delivery.com',
            password: 'clientepassword',
            telefono: '9519876543',
            direccion: 'Macedonio Alcalá 402, Oaxaca',
            rol: 'cliente',
            estado: 'activo'
        });

        console.log(` Creado Admin: ${adminUser.email} (Password: adminpassword)`);
        console.log(` Creado Cliente: ${clientUser.email} (Password: clientepassword)`);
        await userConn.close();

        // --- 2. SEED DE SUCURSALES ---
        console.log('\n[2/5] Conectando a base de datos de Sucursales...');
        const sucConn = await mongoose.createConnection(`${mongoHost}/delivery_sucursales`).asPromise();
        
        const SucursalesSchema = new mongoose.Schema({
            nombre: String,
            direccion: String,
            ubicacion: {
                latitud: Number,
                longitud: Number
            },
            capacidadOperativa: Number,
            estado: { type: Boolean, default: true }
        });
        const SucursalModel = sucConn.model('Sucursal', SucursalesSchema);
        
        await SucursalModel.deleteMany({});
        console.log(' Limpiadas sucursales previas.');

        const sucursalOaxaca = await SucursalModel.create({
            _id: new mongoose.Types.ObjectId('6650dbf7f1a0b1234567890a'), // Forzar ID fijo para consistencia
            nombre: 'Sucursal Centro',
            direccion: 'Macedonio Alcalá 402, Centro Histórico, Oaxaca',
            ubicacion: {
                latitud: 17.0604,
                longitud: -96.7266
            },
            capacidadOperativa: 50,
            estado: true
        });
        console.log(` Creada sucursal principal: ${sucursalOaxaca.nombre} (ID: ${sucursalOaxaca._id})`);
        await sucConn.close();

        // --- 3. SEED DE PRODUCTOS (CATÁLOGO MAESTRO) ---
        console.log('\n[3/5] Conectando a base de datos de Productos e Inventarios...');
        const prodConn = await mongoose.createConnection(`${mongoHost}/sucursales`).asPromise();
        
        const ProductoSchema = new mongoose.Schema({
            nombre: String,
            descripcion: String,
            categoria: String,
            precio: Number,
            disponible: { type: Boolean, default: true }
        });
        const ProductoModel = prodConn.model('Producto', ProductoSchema);
        
        await ProductoModel.deleteMany({});
        console.log(' Limpiado catálogo maestro de productos.');

        const createdProducts = [];
        for (const prodData of productosSeed) {
            const prod = await ProductoModel.create(prodData);
            createdProducts.push(prod);
        }
        console.log(` Creados ${createdProducts.length} productos en el catálogo maestro.`);

        // --- 4. SEED DE INVENTARIO (EXISTENCIAS EN SUCURSAL) ---
        console.log('\n[4/5] Creando stock para los productos en la Sucursal Centro...');
        const InventarioSchema = new mongoose.Schema({
            productoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Producto' },
            sucursalId: mongoose.Schema.Types.ObjectId,
            stock: Number
        });
        const InventarioModel = prodConn.model('Inventario', InventarioSchema);
        
        await InventarioModel.deleteMany({});
        
        for (const prod of createdProducts) {
            await InventarioModel.create({
                productoId: prod._id,
                sucursalId: sucursalOaxaca._id,
                stock: 100 // 100 unidades de stock por defecto
            });
        }
        console.log(` Creadas existencias de stock (100 unidades c/u) asociadas a la sucursal.`);
        await prodConn.close();

        // --- 5. SEED DE REPARTIDORES ---
        console.log('\n[5/5] Conectando a base de datos de Repartidores...');
        const repConn = await mongoose.createConnection(`${mongoHost}/repartidoresdb`).asPromise();
        
        const RepartidorSchema = new mongoose.Schema({
            nombre: String,
            email: String,
            telefono: String,
            vehiculo: {
                tipo: String,
                placa: String
            },
            ubicacion: {
                latitud: Number,
                longitud: Number
            },
            capacidadOperativa: Number,
            estado: { type: String, default: 'disponible' }
        });
        const RepartidorModel = repConn.model('Repartidor', RepartidorSchema);
        
        await RepartidorModel.deleteMany({});
        console.log(' Limpiados repartidores previos.');

        const repartidor1 = await RepartidorModel.create({
            _id: new mongoose.Types.ObjectId('6650dbf7f1a0b1234567890b'), // ID fijo
            nombre: 'Carlos Express',
            email: 'carlos@repartidor.com',
            telefono: '9511112222',
            vehiculo: {
                tipo: 'motocicleta',
                placa: 'MX-12345'
            },
            ubicacion: {
                latitud: 17.0604,
                longitud: -96.7266
            },
            capacidadOperativa: 3,
            estado: 'disponible'
        });
        console.log(` Creado repartidor de prueba: ${repartidor1.nombre} (ID: ${repartidor1._id})`);
        await repConn.close();

        console.log('\n==================================================');
        console.log(' ¡PROCESO TERMINADO CON ÉXITO! ');
        console.log(' Tu base de datos local está lista para pruebas.');
        console.log('==================================================');
        process.exit(0);

    } catch (error) {
        console.error('\n❌ ERROR CRÍTICO AL EJECUTAR SEMILLA:', error.message);
        process.exit(1);
    }
}

seed();
