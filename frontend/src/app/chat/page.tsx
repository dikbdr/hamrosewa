'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchChats } from '@/services/chatService';

type ChatPayload = {
  id: string;
  lastMessage?: string;
  lastMessageAt?: string;
  listing: {
    title: string;
  };
  buyer: {
    firstName?: string;
    lastName?: string;
  };
};

export default function ChatListPage() {
  const router = useRouter();
  const [chats, setChats] = useState<ChatPayload[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('hamroAuthToken') : null;
    if (!token) {
      router.push('/login');
      return;
    }

    const loadChats = async () => {
      try {
        const response = await fetchChats(token);
        setChats(response.data.data);
      } catch (err: any) {
        setError(err?.response?.data?.message || 'Unable to load chats.');
      } finally {
        setLoading(false);
      }
    };

    loadChats();
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-light to-white py-10 px-4">
      <div className="container mx-auto space-y-6">
        <div className="rounded-3xl bg-white p-8 shadow-lg">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-semibold">Your Chats</h1>
              <p className="text-gray-600">View your conversations with buyers and sellers.</p>
            </div>
            <button
              type="button"
              onClick={() => router.push('/listings')}
              className="rounded-2xl bg-secondary px-5 py-3 text-white transition hover:bg-blue-700"
            >
              Browse listings
            </button>
          </div>
        </div>

        {loading ? (
          <div className="rounded-3xl bg-white p-8 shadow-lg text-center">
            <p className="text-lg font-medium">Loading chats...</p>
          </div>
        ) : error ? (
          <div className="rounded-3xl bg-white border border-red-200 p-6 text-red-700 shadow-sm">
            {error}
          </div>
        ) : chats.length === 0 ? (
          <div className="rounded-3xl bg-white p-8 shadow-lg text-center">
            <p className="text-gray-600">No chats yet. Start a conversation from a listing.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {chats.map((chat) => (
              <button
                key={chat.id}
                onClick={() => router.push(`/chat/${chat.id}`)}
                className="rounded-3xl bg-white p-6 shadow-lg text-left hover:shadow-xl transition"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-semibold">{chat.listing.title}</h2>
                    <p className="text-sm text-gray-500">Buyer: {chat.buyer.firstName || 'User'} {chat.buyer.lastName || ''}</p>
                  </div>
                  <p className="text-sm text-gray-500">{chat.lastMessageAt ? new Date(chat.lastMessageAt).toLocaleString() : ''}</p>
                </div>
                <p className="mt-4 text-gray-600">{chat.lastMessage || 'No messages yet.'}</p>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
