import axios from 'axios';

export const client = axios.create({
  baseURL: (import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001') + '/api/v1',
  withCredentials: true,
  timeout: 60000, // 60s — allows for Puppeteer PDF generation (5-10s)
});

client.interceptors.response.use(
  (res) => res,
  async (error) => {
    // For blob responses, the error body is a Blob — parse it to JSON to read the error message
    if (error.response?.data instanceof Blob) {
      try {
        const text = await error.response.data.text();
        const json = JSON.parse(text);
        error.message = json?.error?.message || error.message;
      } catch {
        // Not JSON, ignore
      }
    }
    return Promise.reject(error);
  }
);
