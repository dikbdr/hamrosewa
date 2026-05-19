import { Request, Response, NextFunction } from 'express';
import {
  authenticateUser,
  generateTokens,
  registerUser,
  verifyEmailToken,
  refreshAuthToken,
  findOrCreateOAuthUser,
} from '../services/authService';

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, firstName, lastName } = req.body;
    const user = await registerUser({ email, password, firstName, lastName });

    res.status(201).json({
      success: true,
      message: 'Registration successful. Verification email sent.',
      data: {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const user = await authenticateUser(email, password);
    const tokens = generateTokens(user.id, user.role);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
        },
        tokens,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token } = req.query;
    if (!token || typeof token !== 'string') {
      return res.status(400).json({ success: false, message: 'Verification token is required' });
    }

    await verifyEmailToken(token);

    res.status(200).json({ success: true, message: 'Email verified successfully' });
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken: token } = req.body;
    if (!token) {
      return res.status(400).json({ success: false, message: 'Refresh token is required' });
    }

    const accessToken = await refreshAuthToken(token);
    res.status(200).json({ success: true, accessToken });
  } catch (error) {
    next(error);
  }
};

export const me = async (req: Request, res: Response) => {
  const user = (req as any).user;
  if (!user) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  res.status(200).json({ success: true, data: user });
};

export const oauthCallback = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as any).user;
    if (!user) {
      return res.status(401).json({ success: false, message: 'OAuth authentication failed' });
    }

    const tokens = generateTokens(user.id, user.role);
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const callbackUrl = `${frontendUrl}/auth/callback?token=${tokens.accessToken}&refreshToken=${tokens.refreshToken}`;

    res.redirect(callbackUrl);
  } catch (error) {
    next(error);
  }
};

export const oauthVerify = async (profile: any, provider: 'google' | 'facebook') => {
  const email = profile.emails?.[0]?.value;
  const firstName = profile.name?.givenName || profile.displayName?.split(' ')[0];
  const lastName = profile.name?.familyName || profile.displayName?.split(' ').slice(1).join(' ');
  const providerId = profile.id;

  if (!email) {
    throw new Error('OAuth provider did not return an email address');
  }

  return findOrCreateOAuthUser({ email, firstName, lastName, provider, providerId });
};
