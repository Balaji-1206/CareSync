import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Use mock API for testing when backend is not available
const USE_MOCK_API = true; // Set to false when backend is running
const API_URL = 'http://localhost:5000/api'; // Change to your backend URL

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

// Add token to requests
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error getting token:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired - clear and redirect to login
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('user');
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: async (email, password) => {
    // Mock authentication for testing
    if (USE_MOCK_API) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check credentials
      if (email === 'nurse@hospital.com' && password === 'Nurse123') {
        const mockData = {
          token: 'mock-jwt-token-' + Date.now(),
          user: {
            id: '1',
            email: 'nurse@hospital.com',
            name: 'Sarah Johnson',
            role: 'nurse',
          },
        };
        await AsyncStorage.setItem('authToken', mockData.token);
        await AsyncStorage.setItem('user', JSON.stringify(mockData.user));
        return mockData;
      } else {
        throw new Error('Invalid credentials');
      }
    }
    
    // Real API call when USE_MOCK_API is false
    const response = await api.post('/auth/login', { email, password });
    if (response.data.token) {
      await AsyncStorage.setItem('authToken', response.data.token);
      await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  logout: async () => {
    await AsyncStorage.removeItem('authToken');
    await AsyncStorage.removeItem('user');
    return api.post('/auth/logout');
  },

  getCurrentUser: async () => {
    try {
      const user = await AsyncStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  },

  verifyToken: async () => {
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error) {
      return null;
    }
  },
};

export const vitalsService = {
  getLatestVitals: async (patientId) => {
    const response = await api.get(`/vitals/latest/${patientId}`);
    return response.data;
  },

  getEWSStatus: async (patientId) => {
    const response = await api.get(`/vitals/ews-status/${patientId}`);
    return response.data;
  },

  getVitalHistory: async (patientId, limit = 24) => {
    const response = await api.get(`/vitals/history/${patientId}`, {
      params: { limit },
    });
    return response.data;
  },
};

export default api;
