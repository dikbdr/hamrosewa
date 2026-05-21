import { Request, Response, NextFunction } from 'express';
import {
  listChats,
  getChatById,
  createOrGetChat,
  sendMessage,
  markChatAsRead,
} from '../services/chatService';

export const getChats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as any).user;
    const chats = await listChats(user.id);
    res.status(200).json({ success: true, data: chats });
  } catch (error) {
    next(error);
  }
};

export const getChat = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as any).user;
    const { id } = req.params;
    const chat = await getChatById(id, user.id);
    res.status(200).json({ success: true, data: chat });
  } catch (error) {
    next(error);
  }
};

export const createChat = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as any).user;
    const { listingId } = req.body;
    if (!listingId) {
      return res.status(400).json({ success: false, message: 'listingId is required' });
    }

    const chat = await createOrGetChat({ buyerId: user.id, listingId });
    res.status(201).json({ success: true, message: 'Chat created', data: chat });
  } catch (error) {
    next(error);
  }
};

export const sendChatMessage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as any).user;
    const { id } = req.params;
    const { content, image } = req.body;

    if (!content) {
      return res.status(400).json({ success: false, message: 'Message content is required' });
    }

    const message = await sendMessage({
      chatId: id,
      senderId: user.id,
      content,
      image,
    });

    const io = req.app.get('io');
    if (io) {
      io.to(id).emit('chat-message', message);
    }

    res.status(201).json({ success: true, message: 'Message sent', data: message });
  } catch (error) {
    next(error);
  }
};

export const markChatRead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as any).user;
    const { id } = req.params;
    await markChatAsRead(id, user.id);
    res.status(200).json({ success: true, message: 'Chat marked as read' });
  } catch (error) {
    next(error);
  }
};
