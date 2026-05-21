import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fetchUserProfile = async (token: string) => {
  return api.get('/users/me', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const updateUserProfile = async (token: string, payload: any) => {
  return api.patch('/users/me', payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const changeUserPassword = async (token: string, payload: { currentPassword: string; newPassword: string }) => {
  return api.patch('/users/me/password', payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const uploadUserAvatar = async (token: string, imageData: string) => {
  return api.post(
    '/users/me/avatar',
    { imageData },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const fetchDashboard = async (token: string) => {
  return api.get('/users/dashboard', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
