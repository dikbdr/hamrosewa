import { Router } from 'express';
import passport from 'passport';
import {
  login,
  register,
  verifyEmail,
  refreshToken,
  me,
  oauthCallback,
} from '../controllers/authController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/verify-email', verifyEmail);
router.post('/refresh', refreshToken);
router.get('/me', authenticate, me);

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/auth/login' }),
  oauthCallback
);

router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));
router.get(
  '/facebook/callback',
  passport.authenticate('facebook', { session: false, failureRedirect: '/auth/login' }),
  oauthCallback
);

export default router;
