import { Router } from 'express';
import { authenticate } from '../middleware/authMiddleware';
import { getNotifications, markAsRead, sendNotification } from '../controllers/notificationController';

const router = Router();

router.get('/', authenticate, getNotifications);
router.post('/:id/read', authenticate, markAsRead);
router.post('/send', authenticate, sendNotification);

export default router;
