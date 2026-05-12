const API_URL = 'http://localhost:3000';

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

export const login = async (email, password) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error en el login');
  }
  return response.json();
};

export const getProducts = async () => {
  const response = await fetch(`${API_URL}/products`);
  if (!response.ok) throw new Error('Error al obtener productos');
  return response.json();
};

export const getProduct = async (id) => {
  const response = await fetch(`${API_URL}/products/${id}`);
  if (!response.ok) throw new Error('Error al obtener producto');
  return response.json();
};

export const createOrder = async (items) => {
  const response = await fetch(`${API_URL}/orders`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ items })
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al crear la orden');
  }
  return response.json();
};

export const getMyOrders = async () => {
  const response = await fetch(`${API_URL}/orders/my`, {
    headers: getHeaders()
  });
  if (!response.ok) throw new Error('Error al obtener órdenes');
  return response.json();
};
