import { PaymentMethod, PaymentPurpose, PaymentStatus, Prisma } from '@prisma/client';
import prisma from '../config/prisma';

export interface PaymentCreateData {
  userId: string;
  listingId: string;
  amount: number;
  currency?: string;
  paymentMethod: PaymentMethod;
  paymentGateway: string;
  purpose?: PaymentPurpose;
  metadata?: Prisma.InputJsonValue;
}

export const createPayment = async (data: PaymentCreateData) => {
  return prisma.payment.create({
    data: {
      userId: data.userId,
      listingId: data.listingId,
      amount: data.amount,
      currency: data.currency || 'NPR',
      paymentMethod: data.paymentMethod,
      paymentGateway: data.paymentGateway as any,
      purpose: data.purpose ?? PaymentPurpose.FEATURED,
      metadata: data.metadata ?? Prisma.JsonNull,
      status: PaymentStatus.PENDING,
    },
  });
};

export const verifyPayment = async (paymentId: string, gatewayTransactionId: string, success: boolean) => {
  const payment = await prisma.payment.findUnique({ where: { id: paymentId } });
  if (!payment) throw new Error('Payment not found');

  const updated = await prisma.payment.update({
    where: { id: paymentId },
    data: {
      status: success ? PaymentStatus.COMPLETED : PaymentStatus.FAILED,
      gatewayTransactionId,
      transactionId: `${paymentId}-${Date.now()}`,
      paidAt: success ? new Date() : undefined,
    },
  });

  if (success) {
    await prisma.listing.update({
      where: { id: payment.listingId },
      data: {
        featured: true,
        boosted: payment.purpose === PaymentPurpose.BOOSTED,
        boostedUntil: payment.purpose === PaymentPurpose.BOOSTED ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) : undefined,
      },
    });
  }

  return updated;
};

export const fetchPaymentsForUser = async (userId: string) => {
  return prisma.payment.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    include: { listing: true },
  });
};

export const getPaymentById = async (paymentId: string) => {
  const payment = await prisma.payment.findUnique({
    where: { id: paymentId },
    include: { listing: true },
  });
  if (!payment) throw new Error('Payment not found');
  return payment;
};
