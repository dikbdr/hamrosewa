process.env.JWT_SECRET = 'test-jwt-secret';
process.env.REFRESH_TOKEN_SECRET = 'test-refresh-secret';
process.env.JWT_EXPIRY = '1h';
process.env.REFRESH_TOKEN_EXPIRY = '1d';

jest.mock('../config/prisma', () => ({
  __esModule: true,
  default: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
  },
}));

jest.mock('../utils/email', () => ({
  __esModule: true,
  sendVerificationEmail: jest.fn(),
}));

import jwt from 'jsonwebtoken';
import { UserRole } from '@prisma/client';
import prisma from '../config/prisma';
import { sendVerificationEmail } from '../utils/email';
import * as authService from '../services/authService';

type MockedPrisma = {
  user: {
    findUnique: jest.Mock;
    create: jest.Mock;
    update: jest.Mock;
  };
};

const mockedPrisma = prisma as unknown as MockedPrisma;
const mockedSendVerificationEmail = sendVerificationEmail as jest.Mock;

describe('authService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('generates valid access and refresh tokens', () => {
    const tokens = authService.generateTokens('user-123', UserRole.USER);

    const accessPayload = jwt.verify(tokens.accessToken, process.env.JWT_SECRET!) as any;
    expect(accessPayload.userId).toBe('user-123');
    expect(accessPayload.role).toBe(UserRole.USER);

    const refreshPayload = jwt.verify(tokens.refreshToken, process.env.REFRESH_TOKEN_SECRET!) as any;
    expect(refreshPayload.userId).toBe('user-123');
  });

  it('throws when registering a user with a weak password', async () => {
    await expect(
      authService.registerUser({
        email: 'weak@example.com',
        password: 'weakpass',
        firstName: 'Weak',
        lastName: 'Password',
      })
    ).rejects.toThrow('Password must be at least 10 characters long and include uppercase, lowercase, number, and special character');

    expect(mockedPrisma.user.findUnique).not.toHaveBeenCalled();
  });

  it('registers a new user and sends a verification email', async () => {
    mockedPrisma.user.findUnique.mockResolvedValue(null);
    mockedPrisma.user.create.mockResolvedValue({
      id: 'user-123',
      email: 'new@example.com',
      firstName: 'New',
      lastName: 'User',
      role: UserRole.USER,
      emailVerificationToken: 'token-123',
      emailVerified: false,
    });

    const user = await authService.registerUser({
      email: 'new@example.com',
      password: 'StrongPass1!',
      firstName: 'New',
      lastName: 'User',
    });

    expect(user).toMatchObject({
      id: 'user-123',
      email: 'new@example.com',
      firstName: 'New',
      lastName: 'User',
    });
    expect(mockedPrisma.user.findUnique).toHaveBeenCalledWith({ where: { email: 'new@example.com' } });
    expect(mockedPrisma.user.create).toHaveBeenCalled();
    expect(mockedSendVerificationEmail).toHaveBeenCalledWith('new@example.com', expect.any(String));
  });

  it('resets failed login attempts for a user', async () => {
    mockedPrisma.user.update.mockResolvedValue({
      id: 'user-123',
      failedLoginAttempts: 0,
      lockoutUntil: null,
    });

    const result = await authService.resetLoginAttempts('user-123');

    expect(mockedPrisma.user.update).toHaveBeenCalledWith({
      where: { id: 'user-123' },
      data: { failedLoginAttempts: 0, lockoutUntil: null },
    });
    expect(result).toEqual({
      id: 'user-123',
      failedLoginAttempts: 0,
      lockoutUntil: null,
    });
  });
});
