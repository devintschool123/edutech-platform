// src/api/axiosConfig.ts

import axios from 'axios';
import { useAuthStore } from '../stores/authStore';

const apiClient = axios.create({
  baseURL: 'http://127.0.0.1:8000/api', // Your backend's base API URL
});

// This is an Axios interceptor. It runs before any request is sent.
apiClient.interceptors.request.use(
  (config) => {
    // Get the access token from your Zustand store
    const token = useAuthStore.getState().accessToken;
    if (token) {
      // If the token exists, add the 'Authorization' header to the request
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // Handle any errors that occur during the request
    return Promise.reject(error);
  }
);

export default apiClient;
