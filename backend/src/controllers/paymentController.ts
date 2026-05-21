import { Request, Response, NextFunction } from 'express';
import {
  createPayment,
  verifyPayment,
  fetchPaymentsForUser,
  getPaymentById,
} from '../services/paymentService';
import { sendUserNotification } from '../services/notificationService';

export const createPaymentSession = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as any).user;
    const { listingId, amount, paymentMethod, paymentGateway, purpose, metadata } = req.body;

    if (!listingId || !amount || !paymentMethod || !paymentGateway) {
      return res.status(400).json({ success: false, message: 'Missing payment payload' });
    }

    const payment = await createPayment({
      userId: user.id,
      listingId,
      amount,
      paymentMethod,
      paymentGateway,
      purpose,
      metadata,
    });

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const sessionUrl = `${appUrl}/payment/status?paymentId=${payment.id}`;

    res.status(201).json({
      success: true,
      message: 'Payment session created',
      data: { payment, sessionUrl },
    });
  } catch (error) {
    next(error);
  }
};

export const verifyPaymentSession = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { paymentId, gatewayTransactionId, success } = req.body;
    if (!paymentId) {
      return res.status(400).json({ success: false, message: 'Missing paymentId' });
    }

    const verified = await verifyPayment(paymentId, gatewayTransactionId || '', success === true);

    const notification = await sendUserNotification({
      userId: verified.userId,
      title: verified.status === 'COMPLETED' ? 'Payment Successful' : 'Payment Failed',
      message:
        verified.status === 'COMPLETED'
          ? `Your payment for the listing has been completed successfully.`
          : `Your payment could not be processed. Please try again.`,
      type: verified.status === 'COMPLETED' ? 'PAYMENT_SUCCESS' : 'PAYMENT_FAILED',
      entityType: 'PAYMENT',
      entityId: verified.id,
    });

    res.status(200).json({ success: true, message: 'Payment verified', data: { payment: verified, notification } });
  } catch (error) {
    next(error);
  }
};

export const verifyPaymentRedirect = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const paymentId = typeof req.query.paymentId === 'string' ? req.query.paymentId : undefined;
    const gatewayTransactionId = typeof req.query.gatewayTransactionId === 'string' ? req.query.gatewayTransactionId : '';
    const success = typeof req.query.success === 'string' ? req.query.success === 'true' : true;

    if (!paymentId) {
      return res.status(400).json({ success: false, message: 'Missing paymentId' });
    }

    const verified = await verifyPayment(paymentId, gatewayTransactionId, success);
    const notification = await sendUserNotification({
      userId: verified.userId,
      title: verified.status === 'COMPLETED' ? 'Payment Successful' : 'Payment Failed',
      message:
        verified.status === 'COMPLETED'
          ? `Your payment for the listing has been completed successfully.`
          : `Your payment could not be processed. Please try again.`,
      type: verified.status === 'COMPLETED' ? 'PAYMENT_SUCCESS' : 'PAYMENT_FAILED',
      entityType: 'PAYMENT',
      entityId: verified.id,
    });

    res.status(200).json({ success: true, message: 'Payment verified', data: { payment: verified, notification } });
  } catch (error) {
    next(error);
  }
};

export const paymentWebhook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const webhookSecret = req.headers['x-webhook-secret'];
    const expectedSecret = process.env.PAYMENT_WEBHOOK_SECRET;

    if (expectedSecret && webhookSecret !== expectedSecret) {
      return res.status(401).json({ success: false, message: 'Unauthorized webhook request' });
    }

    const { paymentId, gatewayTransactionId, success } = req.body;
    if (!paymentId) {
      return res.status(400).json({ success: false, message: 'Missing paymentId' });
    }

    const verified = await verifyPayment(paymentId, gatewayTransactionId || '', success === true);
    const notification = await sendUserNotification({
      userId: verified.userId,
      title: verified.status === 'COMPLETED' ? 'Payment Successful' : 'Payment Failed',
      message:
        verified.status === 'COMPLETED'
          ? `Your payment for the listing has been completed successfully.`
          : `Your payment could not be processed. Please try again.`,
      type: verified.status === 'COMPLETED' ? 'PAYMENT_SUCCESS' : 'PAYMENT_FAILED',
      entityType: 'PAYMENT',
      entityId: verified.id,
    });

    res.status(200).json({ success: true, message: 'Webhook processed', data: { payment: verified, notification } });
  } catch (error) {
    next(error);
  }
};

export const getUserPayments = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as any).user;
    const payments = await fetchPaymentsForUser(user.id);
    res.status(200).json({ success: true, data: payments });
  } catch (error) {
    next(error);
  }
};

export const getPaymentDetails = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const payment = await getPaymentById(id);
    res.status(200).json({ success: true, data: payment });
  } catch (error) {
    next(error);
  }
};
