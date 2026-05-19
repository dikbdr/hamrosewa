'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function OAuthCallbackPage() {
  const router = useRouter();
  const [message, setMessage] = useState('Completing login...');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const refreshToken = params.get('refreshToken');

    if (!token) {
      setMessage('Authentication failed. No token found.');
      return;
    }

    try {
      localStorage.setItem('hamroAuthToken', token);
      if (refreshToken) {
        localStorage.setItem('hamroRefreshToken', refreshToken);
      }
      setMessage('Login successful! Redirecting...');
      setTimeout(() => router.push('/'), 1200);
    } catch (error) {
      setMessage('Unable to save authentication tokens. Please try again.');
    }
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-light to-white p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 text-center">
        <h1 className="text-2xl font-bold mb-4">OAuth Login</h1>
        <p className="text-gray-700">{message}</p>
      </div>
    </div>
  );
}
