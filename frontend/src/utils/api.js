// frontend/src/utils/api.js
const API_BASE_URL = import.meta.env.VITE_API_URL;

// --- AUTH ---

export const loginUser = async (credentials) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Login failed');
  }
  return response.json();
};

export const signupUser = async (userData) => {
  const response = await fetch(`${API_BASE_URL}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Signup failed');
  }
  return response.json();
};

export const logoutUser = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

// --- PRODUCTS ---

export const getProducts = async () => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_BASE_URL}/products`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to fetch products');
  }
  return response.json();
};

// --- CART (Optional if syncing with backend) ---

export const syncCartToBackend = async (cartItems) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_BASE_URL}/cart`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ items: cartItems })
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to sync cart');
  }
  return response.json();
};

// --- STRIPE CHECKOUT ---

export const createCheckoutSession = async (cartItems) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_BASE_URL}/checkout/create-checkout-session`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ items: cartItems }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Checkout session creation failed');
  }

  return response.json(); // Contains { id: sessionId }
};
