'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { loginUser } from '@/services/authService';

type FormValues = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const { register, handleSubmit, formState } = useForm<FormValues>();

  const onSubmit = async (values: FormValues) => {
    try {
      setError(null);
      const response = await loginUser(values);
      localStorage.setItem('hamroAuthToken', response.data.data.tokens.accessToken);
      localStorage.setItem('hamroRefreshToken', response.data.data.tokens.refreshToken);
      router.push('/');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Login failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-light to-white p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8">
        <h1 className="text-3xl font-bold mb-6 text-center">Welcome back</h1>
        {error && <div className="mb-4 rounded-lg bg-red-100 text-red-700 p-3">{error}</div>}
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              {...register('email', { required: true })}
              className="w-full rounded-xl border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              {...register('password', { required: true })}
              className="w-full rounded-xl border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <button
            type="submit"
            disabled={formState.isSubmitting}
            className="w-full rounded-xl bg-primary px-4 py-3 text-white font-semibold hover:bg-orange-500 transition"
          >
            {formState.isSubmitting ? 'Signing in...' : 'Login'}
          </button>
        </form>
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600 mb-3">Or continue with</p>
          <div className="flex gap-4 justify-center">
            <a
              href="/api/auth/google"
              className="rounded-xl border border-gray-300 px-4 py-2 hover:bg-gray-50"
            >
              Google
            </a>
            <a
              href="/api/auth/facebook"
              className="rounded-xl border border-gray-300 px-4 py-2 hover:bg-gray-50"
            >
              Facebook
            </a>
          </div>
        </div>
        <p className="mt-4 text-center text-sm text-gray-600">
          Don&apos;t have an account? <a href="/register" className="text-primary font-semibold">Register</a>
        </p>
      </div>
    </div>
  );
}
