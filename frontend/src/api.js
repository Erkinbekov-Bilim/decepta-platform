import axios from 'axios';
import { ACCESS_TOKEN, REFRESH_TOKEN } from './constants';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    console.log('API Request:', config.method.toUpperCase(), config.url, config.data);
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    console.error('API Error:', error.response?.status, error.response?.data);
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem(REFRESH_TOKEN);
        if (refreshToken) {
          const response = await axios.post(
            `${import.meta.env.VITE_API_URL}/api/user/token/refresh/`,
            { refresh: refreshToken }
          );
          localStorage.setItem(ACCESS_TOKEN, response.data.access);
          originalRequest.headers.Authorization = `Bearer ${response.data.access}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        localStorage.removeItem(ACCESS_TOKEN);
        localStorage.removeItem(REFRESH_TOKEN);
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;