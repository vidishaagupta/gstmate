import axios from 'axios';
import { tokenStore } from '../../auth/tokenStore.js';
import { refreshClient } from './refreshClient.js';

export const client = axios.create({
  baseURL: (import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001') + '/api/v1',
  withCredentials: true,
  timeout: 60000, // 60s — allows for Puppeteer PDF generation (5-10s)
});

// Attach access token to every request
client.interceptors.request.use((config) => {
  const token = tokenStore.get();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Single-flight refresh on 401 — prevents multiple simultaneous refresh calls
let isRefreshing = false;
let refreshQueue: Array<{ resolve: Function; reject: Function }> = [];

client.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    
    // For blob responses, the error body is a Blob — parse it to JSON to read the error code
    let errorCode: string | undefined;
    try {
      if (error.response?.data instanceof Blob) {
        const text = await error.response.data.text();
        const json = JSON.parse(text);
        errorCode = json?.error?.code;
      } else {
        errorCode = error.response?.data?.error?.code;
      }
    } catch {
      errorCode = undefined;
    }

    if (
      error.response?.status === 401 &&
      errorCode === 'TOKEN_EXPIRED' &&
      !original._retry
    ) {
      original._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const { data } = await refreshClient.post('/auth/refresh');
          const newToken = data.data.accessToken;
          tokenStore.set(newToken);
          
          // Retry all queued requests
          refreshQueue.forEach(p => p.resolve(newToken));
          refreshQueue = [];
          
          original.headers.Authorization = `Bearer ${newToken}`;
          return client(original);
        } catch (refreshError) {
          refreshQueue.forEach(p => p.reject(refreshError));
          refreshQueue = [];
          tokenStore.clear();
          window.location.href = '/login';
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      // Queue other requests while refreshing
      return new Promise((resolve, reject) => {
        refreshQueue.push({
          resolve: (token: string) => {
            original.headers.Authorization = `Bearer ${token}`;
            resolve(client(original));
          },
          reject: (err: any) => reject(err),
        });
      });
    }

    // If it's a 401 and we're not on a public path, redirect to login
    if (error.response?.status === 401) {
      const isPublicPath = ['/login', '/', '/signup'].includes(window.location.pathname.toLowerCase());
      if (!isPublicPath) {
        tokenStore.clear();
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);
