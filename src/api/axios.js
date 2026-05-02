import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8081/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000, 
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNABORTED') {
      return Promise.reject({
        response: {
          data: { message: 'Server is taking too long to respond. Please try again.' }
        }
      });
    }

    // Only auto-redirect on 401 for NON-auth endpoints.
    // Auth endpoints (login, register, verify-otp) should return errors
    // to the calling component so they can display the message to the user.
    const requestUrl = error.config?.url || '';
    const isAuthEndpoint = requestUrl.includes('/auth/');
    if (error.response?.status === 401 && !isAuthEndpoint) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default API;
