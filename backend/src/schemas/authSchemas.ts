import { z } from 'zod';

const passwordComplexity = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{10,}$/;

export const registerSchema = z.object({
  email: z.string().email({ message: 'Valid email is required' }),
  password: z.string().min(10, { message: 'Password must be at least 10 characters long' }).regex(passwordComplexity, {
    message: 'Password must include uppercase, lowercase, number, and special character',
  }),
  firstName: z.string().min(2).optional(),
  lastName: z.string().min(2).optional(),
});

export const loginSchema = z.object({
  email: z.string().email({ message: 'Valid email is required' }),
  password: z.string().min(8, { message: 'Password is required' }),
});

export const refreshSchema = z.object({
  refreshToken: z.string().min(1, { message: 'Refresh token is required' }).optional(),
});

export const logoutSchema = z.object({
  refreshToken: z.string().min(1, { message: 'Refresh token is required' }).optional(),
});
