'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { verifyEmail } from '@/services/authService';

export default function VerifyEmailPage() {
  const router = useRouter();
  const [message, setMessage] = useState('Verifying your email...');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if (!token) {
      setMessage('Verification token is missing.');
      return;
    }

    verifyEmail(token)
      .then(() => {
        setMessage('Your email has been verified successfully. Redirecting to login...');
        setTimeout(() => router.push('/login'), 2000);
      })
      .catch((error) => {
        setMessage(error?.response?.data?.message || 'Email verification failed.');
      });
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-light to-white p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Email Verification</h1>
        <p className="text-gray-700">{message}</p>
      </div>
    </div>
  );
}
