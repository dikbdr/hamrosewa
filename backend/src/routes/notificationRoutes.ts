import { Router } from 'express';
import { authenticate } from '../middleware/authMiddleware';
import { getNotifications, markAsRead, sendNotification } from '../controllers/notificationController';
import { validateBody } from '../middleware/validateRequest';
import { sendNotificationSchema } from '../schemas/notificationSchemas';

const router = Router();

router.get('/', authenticate, getNotifications);
router.post('/:id/read', authenticate, markAsRead);
router.post('/send', authenticate, validateBody(sendNotificationSchema), sendNotification);

export default router;
