import { Router } from 'express';
import { authenticate } from '../middleware/authMiddleware';
import {
  createPaymentSession,
  verifyPaymentSession,
  verifyPaymentRedirect,
  paymentWebhook,
  getUserPayments,
  getPaymentDetails,
} from '../controllers/paymentController';

const router = Router();

router.post('/create', authenticate, createPaymentSession);
router.post('/verify', authenticate, verifyPaymentSession);
router.get('/verify', verifyPaymentRedirect);
router.post('/webhook', paymentWebhook);
router.get('/history', authenticate, getUserPayments);
router.get('/:id', authenticate, getPaymentDetails);

export default router;
