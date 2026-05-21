import prisma from '../config/prisma';

export interface CreateChatData {
  buyerId: string;
  listingId: string;
}

export interface SendMessageData {
  chatId: string;
  senderId: string;
  content: string;
  image?: string;
}

export const listChats = async (userId: string) => {
  return prisma.chat.findMany({
    where: {
      OR: [
        { buyerId: userId },
        { listing: { sellerId: userId } },
      ],
    },
    orderBy: { updatedAt: 'desc' },
    include: {
      buyer: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          profileImage: true,
        },
      },
      listing: {
        select: {
          id: true,
          title: true,
          slug: true,
          price: true,
          status: true,
        },
      },
      messages: {
        orderBy: { createdAt: 'asc' },
        include: {
          sender: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      },
    },
  });
};

export const getChatById = async (chatId: string, userId: string) => {
  const chat = await prisma.chat.findFirst({
    where: {
      id: chatId,
      OR: [
        { buyerId: userId },
        { listing: { sellerId: userId } },
      ],
    },
    include: {
      buyer: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          profileImage: true,
        },
      },
      listing: true,
      messages: {
        orderBy: { createdAt: 'asc' },
        include: {
          sender: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      },
    },
  });

  if (!chat) {
    throw new Error('Chat not found');
  }

  return chat;
};

export const createOrGetChat = async (data: CreateChatData) => {
  const existingChat = await prisma.chat.findUnique({
    where: {
      buyerId_listingId: {
        buyerId: data.buyerId,
        listingId: data.listingId,
      },
    },
    include: {
      buyer: true,
      listing: true,
      messages: {
        orderBy: { createdAt: 'asc' },
      },
    },
  });

  if (existingChat) {
    return existingChat;
  }

  return prisma.chat.create({
    data: {
      buyerId: data.buyerId,
      listingId: data.listingId,
    },
    include: {
      buyer: true,
      listing: true,
      messages: true,
    },
  });
};

export const sendMessage = async (data: SendMessageData) => {
  const chat = await prisma.chat.findUnique({ where: { id: data.chatId } });
  if (!chat) {
    throw new Error('Chat not found');
  }

  const message = await prisma.message.create({
    data: {
      chatId: data.chatId,
      senderId: data.senderId,
      content: data.content,
      image: data.image,
    },
    include: {
      sender: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      },
    },
  });

  await prisma.chat.update({
    where: { id: data.chatId },
    data: {
      lastMessage: data.content,
      lastMessageAt: new Date(),
    },
  });

  return message;
};

export const markChatAsRead = async (chatId: string, userId: string) => {
  const chat = await prisma.chat.findFirst({
    where: {
      id: chatId,
      OR: [
        { buyerId: userId },
        { listing: { sellerId: userId } },
      ],
    },
  });

  if (!chat) {
    throw new Error('Chat not found');
  }

  await prisma.message.updateMany({
    where: {
      chatId,
      senderId: { not: userId },
      seen: false,
    },
    data: {
      seen: true,
      seenAt: new Date(),
    },
  });

  return true;
};
