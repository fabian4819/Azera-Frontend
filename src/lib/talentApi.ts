import axios from 'axios';

// Instance terpisah dari lib/api.ts — creator (talent) auth pakai token & redirect
// yang berbeda dari staff admin, supaya dua sesi login bisa hidup berdampingan.
const talentApi = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

talentApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('azera_creator_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

talentApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && !error.config?.url?.includes('/creator/login')) {
      localStorage.removeItem('azera_creator_token');
      localStorage.removeItem('azera_creator');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default talentApi;
