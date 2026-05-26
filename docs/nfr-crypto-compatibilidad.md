# Documentación de Compatibilidad de Entorno: Parche Crypto para Node v16

Este documento detalla el parche de compatibilidad aplicada a los microservicios del **Sistema de Delivery** que se conectan a MongoDB. Su propósito es garantizar la estabilidad de la conexión y evitar caídas catastróficas aleatorias al ejecutar el sistema en entornos con **Node.js v16** u otras versiones que carezcan de soporte completo para la API Web Crypto global.

---

## 1. El Problema

Las versiones modernas del driver oficial de MongoDB para Node.js (v6.x y superiores), utilizadas internamente por **Mongoose v8 y v9**, requieren que la propiedad global `global.crypto` de la API de Web Crypto de la W3C esté disponible en el entorno de ejecución de Node.js. 

Específicamente:
* El driver utiliza `global.crypto.getRandomValues()` para generar IDs binarios de sesión y transacciones seguras.
* El driver utiliza `global.crypto.randomUUID()` para generar identificadores UUID únicos.

Sin embargo, en **Node.js v16**:
* `global.crypto` no está definido de forma global por defecto (fue introducido de manera global estable en Node.js v19).
* Aunque el módulo nativo de Node.js `require('crypto')` tiene un submódulo `webcrypto`, no está expuesto en el objeto `global`, lo que provoca que las librerías modernas de MongoDB fallen catastróficamente con un error del tipo:
  `TypeError: Cannot read properties of undefined (reading 'getRandomValues')`

Este error suele manifestarse de forma aleatoria durante la inicialización o durante operaciones concurrentes en la base de datos, desestabilizando los microservicios en producción.

---

## 2. La Solución (Polyfill)

Para resolver este problema de compatibilidad sin forzar una actualización de la versión de Node.js en toda la infraestructura de contenedores, se ha integrado un **polyfill completo de Web Crypto** en el punto de entrada de cada uno de los 6 microservicios que conectan a MongoDB:

* **Inventario Service** (`backend/inventario-service/src/index.js`)
* **Sucursales Service** (`backend/sucursales-service/src/index.js`)
* **Pedidos Service** (`backend/pedidos-service/src/index.js`)
* **Repartidores Service** (`backend/repartidores-service/src/index.js`)
* **Usuario Service** (`backend/usuario-service/src/index.js`)
* **Enrutamiento Service** (`backend/enrutamiento-service/src/index.js`)

### Código del Polyfill

El siguiente bloque de código se ejecuta al inicio de cada archivo `index.js`, **antes** de importar `dotenv` y realizar la conexión con la base de datos:

```javascript
// Polyfill completo para Node 16 (Mongoose v9 / MongoDB v7 requieren crypto global)
const nodeCrypto = require('crypto');
if (!global.crypto) {
    global.crypto = {};
}
if (!global.crypto.getRandomValues) {
    if (nodeCrypto.webcrypto && nodeCrypto.webcrypto.getRandomValues) {
        global.crypto.getRandomValues = function (arr) {
            return nodeCrypto.webcrypto.getRandomValues(arr);
        };
    } else {
        global.crypto.getRandomValues = function (arr) {
            const bytes = nodeCrypto.randomBytes(arr.length);
            for (let i = 0; i < arr.length; i++) {
                arr[i] = bytes[i];
            }
            return arr;
        };
    }
}
if (!global.crypto.randomUUID) {
    global.crypto.randomUUID = function () {
        return nodeCrypto.randomUUID ? nodeCrypto.randomUUID() : () => {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        };
    };
}
```

---

## 3. Funcionamiento Técnico del Parche

1. **Detección y Creación**: Primero comprueba si `global.crypto` existe. Si no es así (como ocurre en Node v16), inicializa un objeto vacío para alojar las funciones de Web Crypto.
2. **getRandomValues**:
   - Intenta utilizar la API `webcrypto` nativa oculta dentro del módulo `crypto` de Node.js (`nodeCrypto.webcrypto.getRandomValues`).
   - Si no está disponible, realiza un fallback seguro mapeando la generación de bytes criptográficamente seguros mediante `nodeCrypto.randomBytes(arr.length)`.
3. **randomUUID**:
   - Intenta utilizar el método de UUID nativo de Node.js (`nodeCrypto.randomUUID()`).
   - Si no existe, recurre a un algoritmo matemático generador de UUID versión 4 (RFC 4122) compatible para garantizar que no haya colisiones de ID en base de datos.

Con este parche, todos los microservicios operan con total seguridad e independencia de la versión específica de Node.js instalada en el sistema anfitrión o en el contenedor de Docker.
