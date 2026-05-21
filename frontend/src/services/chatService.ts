import axios from 'axios';
import { io } from 'socket.io-client';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export type ChatMessagePayload = {
  id: string;
  content: string;
  image?: string;
  seen: boolean;
  seenAt?: string;
  createdAt: string;
  sender: {
    id: string;
    firstName?: string;
    lastName?: string;
  };
};

export type ChatPayload = {
  id: string;
  isActive: boolean;
  lastMessage?: string;
  lastMessageAt?: string;
  createdAt: string;
  updatedAt: string;
  buyer: {
    id: string;
    firstName?: string;
    lastName?: string;
    profileImage?: string;
  };
  listing: {
    id: string;
    title: string;
    slug: string;
    price: number;
    status: string;
  };
  messages: ChatMessagePayload[];
};

export const fetchChats = async (token: string) => {
  return api.get<{ data: ChatPayload[] }>('/chats', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const fetchChat = async (token: string, chatId: string) => {
  return api.get<{ data: ChatPayload }>(`/chats/${chatId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const createChat = async (token: string, listingId: string) => {
  return api.post<{ data: ChatPayload }>('/chats', { listingId }, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const sendChatMessage = async (token: string, chatId: string, content: string, image?: string) => {
  return api.post<{ data: ChatMessagePayload }>(`/chats/${chatId}/message`, { content, image }, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const markChatAsRead = async (token: string, chatId: string) => {
  return api.post(`/chats/${chatId}/read`, {}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const apiBaseUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').replace(/\/api$/, '');

export const createSocket = () => {
  return io(apiBaseUrl, {
    path: '/socket.io',
  });
};
