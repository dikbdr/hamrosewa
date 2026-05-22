import bcrypt from 'bcrypt';
import jwt, { type Secret } from 'jsonwebtoken';
import crypto from 'crypto';
import prisma from '../config/prisma';
import { UserRole } from '@prisma/client';
import { sendVerificationEmail } from '../utils/email';

const jwtSecret: Secret = process.env.JWT_SECRET || 'super-secret-key';
const refreshSecret: Secret = process.env.REFRESH_TOKEN_SECRET || 'refresh-secret-key';
const jwtExpiry = process.env.JWT_EXPIRY || '7d';
const refreshExpiry = process.env.REFRESH_TOKEN_EXPIRY || '30d';

export const hashPassword = async (password: string) => {
  return bcrypt.hash(password, 10);
};

export const comparePassword = async (password: string, hash: string) => {
  return bcrypt.compare(password, hash);
};

export const createAccessToken = (userId: string, role: UserRole) => {
  const options: jwt.SignOptions = {
    expiresIn: jwtExpiry as jwt.SignOptions['expiresIn'],
  };
  return jwt.sign({ userId, role }, jwtSecret, options);
};

export const createRefreshToken = (userId: string) => {
  const options: jwt.SignOptions = {
    expiresIn: refreshExpiry as jwt.SignOptions['expiresIn'],
  };
  return jwt.sign({ userId }, refreshSecret, options);
};

export const sendEmailVerification = async (email: string, token: string) => {
  await sendVerificationEmail(email, token);
};

const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{10,}$/;

export const registerUser = async ({
  email,
  password,
  firstName,
  lastName,
}: {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}) => {
  if (!strongPasswordRegex.test(password)) {
    throw new Error('Password must be at least 10 characters long and include uppercase, lowercase, number, and special character');
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw new Error('Email already registered');
  }

  const hashedPassword = await hashPassword(password);
  const emailVerificationToken = crypto.randomBytes(32).toString('hex');

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      firstName,
      lastName,
      role: UserRole.USER,
      emailVerificationToken,
      emailVerified: false,
    },
  });

  await sendEmailVerification(email, emailVerificationToken);

  return user;
};

const lockoutThreshold = 5;
const lockoutDurationMs = 15 * 60 * 1000; // 15 minutes

const parseExpiryToMs = (expiry: string) => {
  if (expiry.endsWith('d')) {
    return Number(expiry.slice(0, -1)) * 24 * 60 * 60 * 1000;
  }
  if (expiry.endsWith('h')) {
    return Number(expiry.slice(0, -1)) * 60 * 60 * 1000;
  }
  if (expiry.endsWith('m')) {
    return Number(expiry.slice(0, -1)) * 60 * 1000;
  }
  return 30 * 24 * 60 * 60 * 1000;
};

export const resetLoginAttempts = async (userId: string) => {
  return prisma.user.update({
    where: { id: userId },
    data: { failedLoginAttempts: 0, lockoutUntil: null } as any,
  });
};

export const incrementFailedLoginAttempt = async (userId: string, currentAttempts: number) => {
  const attempts = currentAttempts + 1;
  const updateData: any = { failedLoginAttempts: attempts };

  if (attempts >= lockoutThreshold) {
    updateData.lockoutUntil = new Date(Date.now() + lockoutDurationMs);
    updateData.failedLoginAttempts = 0;
  }

  return prisma.user.update({
    where: { id: userId },
    data: updateData,
  });
};

export const storeRefreshToken = async (userId: string, token: string) => {
  const expiresAt = new Date(Date.now() + parseExpiryToMs(refreshExpiry));
  return prisma.user.update({
    where: { id: userId },
    data: { refreshToken: token, refreshTokenExpiry: expiresAt } as any,
  });
};

export const validateRefreshToken = async (token: string) => {
  const payload = jwt.verify(token, refreshSecret, { algorithms: ['HS256'] }) as { userId: string };
  const user = await prisma.user.findUnique({ where: { id: payload.userId } });
  const userAny = user as any;
  if (!user || userAny.refreshToken !== token || !userAny.refreshTokenExpiry || userAny.refreshTokenExpiry < new Date()) {
    throw new Error('Invalid refresh token');
  }

  return user;
};

export const authenticateUser = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  const userAny = user as any;
  if (!user || !user.password) {
    if (user) {
      await incrementFailedLoginAttempt(user.id, userAny.failedLoginAttempts || 0);
    }
    throw new Error('Invalid email or password');
  }

  if (userAny.lockoutUntil && userAny.lockoutUntil > new Date()) {
    throw new Error(`Account locked until ${userAny.lockoutUntil.toISOString()}. Please try again later.`);
  }

  const isValid = await comparePassword(password, user.password);
  if (!isValid) {
    await incrementFailedLoginAttempt(user.id, userAny.failedLoginAttempts || 0);
    throw new Error('Invalid email or password');
  }

  if (!user.emailVerified) {
    throw new Error('Email not verified. Please check your inbox.');
  }

  await resetLoginAttempts(user.id);
  return prisma.user.update({
    where: { id: user.id },
    data: { lastLogin: new Date() },
  });
};

export const verifyEmailToken = async (token: string) => {
  const user = await prisma.user.findFirst({ where: { emailVerificationToken: token } });
  if (!user) {
    throw new Error('Invalid or expired verification token');
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { emailVerified: true, emailVerificationToken: null },
  });

  return user;
};

export const generateTokens = (userId: string, role: UserRole) => ({
  accessToken: createAccessToken(userId, role),
  refreshToken: createRefreshToken(userId),
});

export const refreshAuthToken = async (token: string) => {
  const user = await validateRefreshToken(token);
  const accessToken = createAccessToken(user.id, user.role);
  const newRefreshToken = createRefreshToken(user.id);
  await storeRefreshToken(user.id, newRefreshToken);

  return { accessToken, refreshToken: newRefreshToken };
};

export const revokeRefreshToken = async (userId: string) => {
  return prisma.user.update({
    where: { id: userId },
    data: { refreshToken: null, refreshTokenExpiry: null } as any,
  });
};

export const revokeRefreshTokenByToken = async (token: string) => {
  try {
    const payload = jwt.verify(token, refreshSecret, { algorithms: ['HS256'] }) as { userId: string };
    const user = await prisma.user.findUnique({ where: { id: payload.userId } });
    const userAny = user as any;

    if (!user || userAny.refreshToken !== token) {
      return false;
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: null, refreshTokenExpiry: null } as any,
    });

    return true;
  } catch {
    return false;
  }
};

export const findOrCreateOAuthUser = async ({
  email,
  firstName,
  lastName,
  provider,
  providerId,
}: {
  email: string;
  firstName?: string;
  lastName?: string;
  provider: 'google' | 'facebook';
  providerId: string;
}) => {
  const data: any = {
    email,
    firstName,
    lastName,
    emailVerified: true,
  };

  if (provider === 'google') {
    data.googleId = providerId;
  }
  if (provider === 'facebook') {
    data.facebookId = providerId;
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    if (provider === 'google' && existing.googleId !== providerId) {
      await prisma.user.update({ where: { id: existing.id }, data: { googleId: providerId } });
    }
    if (provider === 'facebook' && existing.facebookId !== providerId) {
      await prisma.user.update({ where: { id: existing.id }, data: { facebookId: providerId } });
    }
    return existing;
  }

  const user = await prisma.user.create({ data });
  return user;
};
