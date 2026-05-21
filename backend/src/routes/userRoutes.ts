import { Router } from 'express';
import {
  getMyProfile,
  updateMyProfile,
  changePassword,
  uploadAvatar,
  getDashboard,
} from '../controllers/userController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

router.get('/me', authenticate, getMyProfile);
router.patch('/me', authenticate, updateMyProfile);
router.patch('/me/password', authenticate, changePassword);
router.post('/me/avatar', authenticate, uploadAvatar);
router.get('/dashboard', authenticate, getDashboard);

export default router;
