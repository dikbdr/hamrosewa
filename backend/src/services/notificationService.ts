import prisma from '../config/prisma';
import { sendEmail } from '../utils/email';

export interface NotificationCreateData {
  userId: string;
  title: string;
  message: string;
  type: string;
  entityType?: string;
  entityId?: string;
}

export const createNotification = async (data: NotificationCreateData) => {
  return prisma.notification.create({
    data: {
      userId: data.userId,
      title: data.title,
      message: data.message,
      type: data.type as any,
      entityType: data.entityType,
      entityId: data.entityId,
    },
  });
};

export const sendUserNotification = async (data: NotificationCreateData) => {
  const user = await prisma.user.findUnique({
    where: { id: data.userId },
    select: {
      email: true,
      notifications: true,
      marketingEmails: true,
    },
  });

  if (!user) {
    throw new Error('User not found');
  }

  let notification = null;

  if (user.notifications) {
    notification = await createNotification(data);
  }

  if (user.marketingEmails && user.email) {
    const subject = `HamroSewa: ${data.title}`;
    const html = `
      <p>${data.message}</p>
      <p>Visit HamroSewa to view the latest update.</p>
    `;
    await sendEmail({
      to: user.email,
      subject,
      html,
    });
  }

  return notification;
};

export const fetchNotifications = async (userId: string) => {
  return prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
};

export const markNotificationRead = async (notificationId: string, userId: string) => {
  const notification = await prisma.notification.findUnique({ where: { id: notificationId } });
  if (!notification || notification.userId !== userId) {
    throw new Error('Notification not found');
  }

  return prisma.notification.update({
    where: { id: notificationId },
    data: { isRead: true, readAt: new Date() },
  });
};
