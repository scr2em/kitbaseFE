import { Api } from '../../generated-api';
import axios from 'axios';
import { tokenStorage } from '../lib/cookies';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL 
});

// Add request interceptor to include auth token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = tokenStorage.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle token refresh
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = tokenStorage.getRefreshToken();
        if (refreshToken) {
          const api = new Api();
          const response = await api.auth.refreshToken({ refreshToken });
          
          if(!response.data.accessToken || !response.data.refreshToken) {
            throw new Error('No access token or refresh token in response');
          }
          
          tokenStorage.setAccessToken(response.data.accessToken);
          tokenStorage.setRefreshToken(response.data.refreshToken);

          originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;
          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        // Clear tokens and redirect to login
        tokenStorage.clearTokens();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export const apiClient = new Api({
  baseURL: import.meta.env.VITE_API_URL 
});

// Override the axios instance
apiClient.instance = axiosInstance;
