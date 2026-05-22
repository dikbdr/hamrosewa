import { Request, Response, NextFunction } from 'express';
import { fetchNotifications, markNotificationRead, sendUserNotification } from '../services/notificationService';
import { auditLog } from '../utils/auditLogger';

export const getNotifications = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as any).user;
    const notifications = await fetchNotifications(user.id);
    res.status(200).json({ success: true, data: notifications });
  } catch (error) {
    next(error);
  }
};

export const markAsRead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const user = (req as any).user;
    const notification = await markNotificationRead(id, user.id);
    res.status(200).json({ success: true, data: notification });
  } catch (error) {
    next(error);
  }
};

export const sendNotification = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, title, message, type, entityType, entityId } = req.body;
    if (!userId || !title || !message || !type) {
      return res.status(400).json({ success: false, message: 'Missing notification payload' });
    }

    const notification = await sendUserNotification({ userId, title, message, type, entityType, entityId });
    auditLog('notification.send', { userId, title, type, entityType, entityId });
    const io = req.app.get('io');
    if (io && notification) {
      io.to(userId).emit('notification', notification);
    }

    res.status(201).json({ success: true, data: notification });
  } catch (error) {
    next(error);
  }
};
