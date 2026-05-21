import { Router } from 'express';
import { authenticate } from '../middleware/authMiddleware';
import {
  getChats,
  getChat,
  createChat,
  sendChatMessage,
  markChatRead,
} from '../controllers/chatController';

const router = Router();

router.use(authenticate);
router.get('/', getChats);
router.get('/:id', getChat);
router.post('/', createChat);
router.post('/:id/message', sendChatMessage);
router.post('/:id/read', markChatRead);

export default router;
