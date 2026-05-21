import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export type PaymentPayload = {
  id: string;
  userId: string;
  listingId: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  paymentGateway: string;
  status: string;
  purpose: string;
  transactionId?: string;
  createdAt: string;
  updatedAt: string;
  paidAt?: string;
  listing: {
    id: string;
    title: string;
    price: number;
    status: string;
  };
};

export const createPaymentSession = async (token: string, payload: {
  listingId: string;
  amount: number;
  paymentMethod: string;
  paymentGateway: string;
  purpose?: string;
  metadata?: Record<string, unknown>;
}) => {
  return api.post('/payments/create', payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const verifyPaymentSession = async (token: string, payload: {
  paymentId: string;
  gatewayTransactionId?: string;
  success: boolean;
}) => {
  return api.post('/payments/verify', payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const fetchPaymentHistory = async (token: string) => {
  return api.get<{ data: PaymentPayload[] }>('/payments/history', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const fetchPaymentDetails = async (token: string, paymentId: string) => {
  return api.get<{ data: PaymentPayload }>(`/payments/${paymentId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
