import axios from 'axios';

const api = axios.create({
  baseURL: 'https://intrusion-detection-bf0a.onrender.com',
});

// --- ATTACH TOKEN ---
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

// --- HANDLE SESSION EXPIRY ---
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If the backend says the token is invalid (401/403), boot to login
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      localStorage.clear();
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const adminService = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getAllAttacks: () => api.get('/dashboard'), 
  getBlockedIps: () => api.get('/blocked-ip'),
  blockIp: (ip, details) => api.post(`/admin/block-ip?ip=${ip}`, details),
  unblockIp: (ip) => api.post(`/admin/unblock-ip?ip=${ip}`),
};

export default api;