const API_URL = 'http://localhost:3000/api';

export const getProducts = async () => {
  const res = await fetch(`${API_URL}/products`);
  return res.json();
};

export const getUsers = async () => {
  const res = await fetch(`${API_URL}/users`);
  return res.json();
};
