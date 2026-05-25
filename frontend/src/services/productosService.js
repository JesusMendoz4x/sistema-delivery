// Servicio de Productos
// El equipo de backend solo necesita reemplazar los Promise.resolve por llamadas a 'api.js'

let MOCK_DATA = [
  { id: 1, nombre: "Tonkotsu Ramen", precio: 180.00, categoria: "Plato Principal", icono: "ramen_dining", destacado: true },
  { id: 2, nombre: "Gyoza de Wagyu", precio: 124.00, categoria: "Entradas", icono: "set_meal", destacado: true },
  { id: 3, nombre: "Nigiri de Toro", precio: 95.00, categoria: "Sushi", icono: "restaurant", destacado: false },
  { id: 4, nombre: "Edamames al Vapor", precio: 65.00, categoria: "Entradas", icono: "eco", destacado: false },
  { id: 5, nombre: "Mochi de Matcha", precio: 85.00, categoria: "Postres", icono: "icecream", destacado: false },
  { id: 6, nombre: "Sashimi Mixto", precio: 220.00, categoria: "Sushi", icono: "set_meal", destacado: true },
];

export const getProductos = async () => {
  // return await api.get('/productos').then(res => res.data);
  return Promise.resolve([...MOCK_DATA]);
};

export const createProducto = async (data) => {
  // return await api.post('/productos', data).then(res => res.data);
  const newProduct = { id: Date.now(), ...data };
  MOCK_DATA.push(newProduct);
  return Promise.resolve(newProduct);
};

export const updateProducto = async (id, data) => {
  // return await api.put(`/productos/${id}`, data).then(res => res.data);
  const index = MOCK_DATA.findIndex(p => p.id === id);
  if(index !== -1) MOCK_DATA[index] = { ...MOCK_DATA[index], ...data };
  return Promise.resolve(MOCK_DATA[index]);
};

export const deleteProducto = async (id) => {
  // return await api.delete(`/productos/${id}`);
  MOCK_DATA = MOCK_DATA.filter(p => p.id !== id);
  return Promise.resolve(true);
};
