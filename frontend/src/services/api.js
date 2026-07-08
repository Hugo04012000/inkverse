import axios from 'axios';

const api = axios.create({
  baseURL: 'https://inkverse-production-ef81.up.railway.app/api',
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const login = (email, password) =>
  api.post('/auth/login', { email, password });

export const register = (datos) =>
  api.post('/auth/register', datos);

export default api;