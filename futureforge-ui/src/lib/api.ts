import axios from 'axios';

// Create a centralized Axios instance
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080', // Uses environment variable or falls back to localhost
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercept outgoing requests to attach the Bearer token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercept incoming responses to handle global errors (e.g., 401 Unauthorized)
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token is invalid or expired
      localStorage.removeItem('accessToken');
      // Redirect to login only if not already on login/register
      if (!window.location.pathname.startsWith('/auth')) {
        window.location.href = '/auth/login?expired=true';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
