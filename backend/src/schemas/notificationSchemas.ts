import { z } from 'zod';

export const sendNotificationSchema = z.object({
  userId: z.string().uuid({ message: 'Valid user ID is required' }),
  title: z.string().min(3, { message: 'Title is required' }),
  message: z.string().min(5, { message: 'Message is required' }),
  type: z.string().min(2, { message: 'Type is required' }),
  entityType: z.string().optional(),
  entityId: z.string().optional(),
});
