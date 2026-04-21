import axios from 'axios';

// Separate instance for refresh calls to avoid infinite interceptor loops
export const refreshClient = axios.create({
  baseURL: (import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001') + '/api/v1',
  withCredentials: true,
});
