import axios from 'axios';

// Instance terpisah dari lib/api.ts dan lib/talentApi.ts — akun PIC/Handle-by
// punya token & redirect sendiri, supaya beberapa sesi login bisa hidup berdampingan.
const picApi = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

picApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('azera_pic_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

picApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && !error.config?.url?.includes('/pic/login')) {
      localStorage.removeItem('azera_pic_token');
      localStorage.removeItem('azera_pic');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default picApi;
