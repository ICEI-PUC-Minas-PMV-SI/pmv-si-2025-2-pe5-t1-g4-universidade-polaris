import api_client from './api-client.js';

export const auth_service = {
  login: async (email, password) => {
    const response = await api_client.post('/auth/login', { email, password });
    if (response.success && response.data?.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      return response;
    }
    if (response.error) {
      const error = new Error(response.error);
      error.response = response;
      throw error;
    }
    return response;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getProfile: async () => {
    return await api_client.get('/auth/profile');
  },

  updateProfile: async (data) => {
    return await api_client.put('/auth/profile', data);
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  getUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  getToken: () => {
    return localStorage.getItem('token');
  },

  createUser: async (userData) => {
    return await api_client.post('/users/', userData);
  },

  getAllUsers: async (page = 1, limit = 10) => {
    return await api_client.get(`/users/?page=${page}&limit=${limit}`);
  },

  getUserById: async (userId) => {
    return await api_client.get(`/users/${userId}`);
  },

  updateUser: async (userId, userData) => {
    return await api_client.put(`/users/${userId}`, userData);
  },

  deleteUser: async (userId) => {
    return await api_client.delete(`/users/${userId}`);
  },
};

