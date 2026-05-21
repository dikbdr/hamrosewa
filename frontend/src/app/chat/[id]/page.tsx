'use client';

import { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createSocket, fetchChat, sendChatMessage, markChatAsRead } from '@/services/chatService';
import type { ChatPayload, ChatMessagePayload } from '@/services/chatService';

export default function ChatRoomPage() {
  const { id } = useParams();
  const router = useRouter();
  const [chat, setChat] = useState<ChatPayload | null>(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessagePayload[]>([]);
  const socketRef = useRef<any>(null);
  const token = typeof window !== 'undefined' ? localStorage.getItem('hamroAuthToken') : null;

  const socket = useMemo(() => {
    if (typeof window === 'undefined') return null;
    return createSocket();
  }, []);

  useEffect(() => {
    if (!token) {
      router.push('/login');
      return;
    }

    if (!id) {
      router.push('/chat');
      return;
    }

    const loadChat = async () => {
      try {
        const response = await fetchChat(token, id);
        setChat(response.data.data);
        setMessages(response.data.data.messages);
        await markChatAsRead(token, id);
      } catch (err: any) {
        setError(err?.response?.data?.message || 'Unable to load chat.');
      } finally {
        setLoading(false);
      }
    };

    loadChat();
  }, [id, router, token]);

  useEffect(() => {
    if (!socket || !id) return undefined;
    socketRef.current = socket;
    socket.emit('join-chat', id);
    socket.on('chat-message', (newMessage: ChatMessagePayload) => {
      setMessages((prev) => [...prev, newMessage]);
    });

    return () => {
      socket.emit('leave-chat', id);
      socket.off('chat-message');
    };
  }, [socket, id]);

  const handleSend = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!token || !id || !message.trim()) {
      return;
    }

    setSending(true);
    try {
      const response = await sendChatMessage(token, id, message.trim());
      setMessages((prev) => [...prev, response.data.data]);
      setMessage('');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Unable to send message.');
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-light p-4">
        <div className="rounded-3xl bg-white p-10 shadow-xl text-center">
          <p className="text-lg font-medium">Loading chat room...</p>
        </div>
      </div>
    );
  }

  if (error || !chat) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-light p-4">
        <div className="rounded-3xl bg-white p-10 shadow-xl text-center">
          <p className="text-lg font-medium text-red-600">{error || 'Chat not found.'}</p>
          <button
            onClick={() => router.push('/chat')}
            className="mt-4 rounded-xl bg-primary px-4 py-2 text-white hover:bg-orange-500 transition"
          >
            Back to chats
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-light to-white py-10 px-4">
      <div className="container mx-auto space-y-6">
        <div className="rounded-3xl bg-white p-8 shadow-lg">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-semibold">Chat about {chat.listing.title}</h1>
              <p className="text-gray-600">Messages with the buyer/seller for this listing.</p>
            </div>
            <button
              type="button"
              onClick={() => router.push('/chat')}
              className="rounded-2xl bg-secondary px-5 py-3 text-white transition hover:bg-blue-700"
            >
              Back to chats
            </button>
          </div>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-lg">
          <div className="space-y-4 max-h-[60vh] overflow-y-auto">
            {messages.map((msg) => (
              <div key={msg.id} className="rounded-3xl border border-gray-200 p-4">
                <p className="text-sm text-gray-500">{msg.sender.firstName || 'User'} {msg.sender.lastName || ''}</p>
                <p className="mt-2 text-gray-900">{msg.content}</p>
                {msg.image && <img src={msg.image} alt="chat" className="mt-3 max-h-80 w-full rounded-3xl object-cover" />}
                <p className="text-xs text-gray-400 mt-2">{new Date(msg.createdAt).toLocaleString()}</p>
              </div>
            ))}
          </div>

          <form className="mt-6 space-y-4" onSubmit={handleSend}>
            <textarea
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              className="w-full rounded-3xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
              rows={4}
              placeholder="Type your reply..."
            />
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="submit"
                disabled={sending}
                className="rounded-3xl bg-primary px-6 py-3 text-white font-semibold hover:bg-orange-500 transition disabled:opacity-50"
              >
                {sending ? 'Sending...' : 'Send message'}
              </button>
              <div className="text-sm text-gray-500">Chat status: {chat.listing.status}</div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
