import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5001',
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
});

// Add a request interceptor to include the token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (!error.response) {
      return Promise.reject({
        message: 'Network error - please check your connection'
      });
    }

    // Handle specific error cases
    switch (error.response.status) {
      case 401:
        // Clear token and redirect to login on authentication error
        localStorage.removeItem('token');
        window.location.href = '/login';
        return Promise.reject({
          message: 'Session expired - please login again'
        });
      case 403:
        return Promise.reject({
          message: 'You do not have permission to perform this action'
        });
      case 429:
        return Promise.reject({
          message: 'Too many requests - please try again later'
        });
      case 500:
        return Promise.reject({
          message: 'Server error - please try again later'
        });
      default:
        return Promise.reject(
          error.response.data || { message: 'An unexpected error occurred' }
        );
    }
  }
);

export default api;