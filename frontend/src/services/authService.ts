import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const registerUser = async (payload: {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}) => {
  return api.post('/auth/register', payload);
};

export const loginUser = async (payload: { email: string; password: string }) => {
  return api.post('/auth/login', payload);
};

export const refreshToken = async (refreshToken: string) => {
  return api.post('/auth/refresh', { refreshToken });
};

export const fetchMe = async (token: string) => {
  return api.get('/auth/me', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const verifyEmail = async (token: string) => {
  return api.get(`/auth/verify-email?token=${encodeURIComponent(token)}`);
};
