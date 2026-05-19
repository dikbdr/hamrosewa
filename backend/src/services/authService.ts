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

export const authenticateUser = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.password) {
    throw new Error('Invalid email or password');
  }

  const isValid = await comparePassword(password, user.password);
  if (!isValid) {
    throw new Error('Invalid email or password');
  }

  if (!user.emailVerified) {
    throw new Error('Email not verified. Please check your inbox.');
  }

  return user;
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
  const payload = jwt.verify(token, refreshSecret) as { userId: string };
  const user = await prisma.user.findUnique({ where: { id: payload.userId } });
  if (!user) {
    throw new Error('User not found');
  }

  return createAccessToken(user.id, user.role);
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
