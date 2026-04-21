import { client } from '../lib/api/client.js';

export const login = async (data: any) => {
  const res = await client.post('/auth/login', data);
  return res.data;
};

export const signup = async (data: any) => {
  const res = await client.post('/auth/signup', data);
  return res.data;
};

export const getMe = async () => {
  const res = await client.get('/auth/me');
  return res.data;
};

export const updateProfile = async (data: any) => {
  const res = await client.patch('/auth/me', data);
  return res.data;
};
