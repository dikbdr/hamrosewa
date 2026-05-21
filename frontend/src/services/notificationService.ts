import axios from 'axios';

export type NotificationPayload = {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: string;
  entityType?: string;
  entityId?: string;
  isRead: boolean;
  readAt?: string;
  createdAt: string;
};

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fetchNotifications = async (token: string) => {
  return api.get<{ data: NotificationPayload[] }>('/notifications', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const markNotificationRead = async (token: string, notificationId: string) => {
  return api.post(`/notifications/${notificationId}/read`, {}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const sendNotification = async (token: string, payload: {
  userId: string;
  title: string;
  message: string;
  type: string;
  entityType?: string;
  entityId?: string;
}) => {
  return api.post('/notifications/send', payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
