import { Router } from 'express';
import passport from 'passport';
import {
  login,
  register,
  verifyEmail,
  refreshToken,
  logout,
  me,
  oauthCallback,
} from '../controllers/authController';
import { authenticate } from '../middleware/authMiddleware';
import { loginRateLimiter } from '../middleware/loginRateLimiter';
import { validateBody } from '../middleware/validateRequest';
import { loginSchema, registerSchema, refreshSchema, logoutSchema } from '../schemas/authSchemas';

const router = Router();

router.post('/register', validateBody(registerSchema), register);
router.post('/login', loginRateLimiter, validateBody(loginSchema), login);
router.get('/verify-email', verifyEmail);
router.post('/refresh', validateBody(refreshSchema), refreshToken);
router.post('/logout', validateBody(logoutSchema), logout);
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
