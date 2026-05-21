import prisma from '../config/prisma';
import cloudinary from '../config/cloudinary';
import { comparePassword, hashPassword } from './authService';

export interface UserProfileUpdateData {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  bio?: string;
  city?: string;
  district?: string;
  address?: string;
  language?: string;
  notifications?: boolean;
  marketingEmails?: boolean;
}

export const getUserById = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new Error('User not found');
  }

  return user;
};

export const updateUserProfile = async (userId: string, data: UserProfileUpdateData) => {
  const allowedData = {
    firstName: data.firstName,
    lastName: data.lastName,
    phoneNumber: data.phoneNumber,
    bio: data.bio,
    city: data.city,
    district: data.district,
    address: data.address,
    language: data.language,
    notifications: data.notifications,
    marketingEmails: data.marketingEmails,
  };

  const user = await prisma.user.update({
    where: { id: userId },
    data: allowedData,
  });

  return user;
};

export const changeUserPassword = async (
  userId: string,
  currentPassword: string,
  newPassword: string
) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user || !user.password) {
    throw new Error('User not found or password not set');
  }

  const passwordMatches = await comparePassword(currentPassword, user.password);
  if (!passwordMatches) {
    throw new Error('Current password is incorrect');
  }

  const hashedPassword = await hashPassword(newPassword);
  await prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword },
  });

  return true;
};

export const uploadProfileImage = async (userId: string, imageData: string) => {
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    throw new Error('Cloudinary configuration is missing');
  }

  const uploadResult = await cloudinary.uploader.upload(imageData, {
    folder: 'hamrosewa/users',
    transformation: [{ width: 500, height: 500, crop: 'fill', gravity: 'face' }],
  });

  const user = await prisma.user.update({
    where: { id: userId },
    data: { profileImage: uploadResult.secure_url },
  });

  return user;
};

export const getUserDashboardSummary = async (userId: string) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) {
    throw new Error('User not found');
  }

  const [totalListings, activeListings, favoritesCount, chatCount, messageCount] = await Promise.all([
    prisma.listing.count({ where: { sellerId: userId } }),
    prisma.listing.count({ where: { sellerId: userId, status: 'ACTIVE' } }),
    prisma.favorite.count({ where: { userId } }),
    prisma.chat.count({ where: { buyerId: userId } }),
    prisma.message.count({ where: { senderId: userId } }),
  ]);

  return {
    fullName: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email,
    email: user.email,
    profileImage: user.profileImage,
    role: user.role,
    emailVerified: user.emailVerified,
    joinedAt: user.createdAt.toISOString(),
    totalListings,
    activeListings,
    favoritesCount,
    chatCount,
    messageCount,
  };
};
