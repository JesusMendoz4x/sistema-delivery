//Importamos el módulo app que contiene la configuración de Express
const app = require('./app');
//Definimos el puerto en el que se ejecutará el servidor
const PORT = process.env.PORT || 3000;
//Iniciamos el servidor y escuchamos en el puerto definido
app.listen(PORT, () => {
    console.log(`Servidor de sucursales escuchando en el puerto ${PORT}`);
});