import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const api = axios.create({ baseURL: API_URL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const authApi = {
  register: (data: { email: string; name: string; password: string }) =>
    api.post('/auth/register', data).then(r => r.data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data).then(r => r.data),
};

export const reviewsApi = {
  getAll: (teamId: string) => api.get(`/reviews?teamId=${teamId}`).then(r => r.data),
  getOne: (id: string) => api.get(`/reviews/${id}`).then(r => r.data),
  getStats: (teamId: string) => api.get(`/reviews/stats?teamId=${teamId}`).then(r => r.data),
};

export const teamsApi = {
  getAll: () => api.get('/teams').then(r => r.data),
  getOne: (id: string) => api.get(`/teams/${id}`).then(r => r.data),
  create: (name: string) => api.post('/teams', { name }).then(r => r.data),
  update: (id: string, data: any) => api.patch(`/teams/${id}`, data).then(r => r.data),
};
