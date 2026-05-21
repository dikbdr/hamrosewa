import { ListingStatus, UserRole } from '@prisma/client';
import prisma from '../config/prisma';

export const fetchAdminOverview = async () => {
  const totalUsers = await prisma.user.count();
  const totalListings = await prisma.listing.count();
  const activeListings = await prisma.listing.count({ where: { status: 'ACTIVE' } });
  const totalPayments = await prisma.payment.count();
  const totalChats = await prisma.chat.count();
  const unreadNotifications = await prisma.notification.count({ where: { isRead: false } });

  return {
    totalUsers,
    totalListings,
    activeListings,
    totalPayments,
    totalChats,
    unreadNotifications,
  };
};

export const fetchUsers = async () => {
  return prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      role: true,
      emailVerified: true,
      isSuspended: true,
      createdAt: true,
    },
  });
};

export const updateUserRole = async (userId: string, role: string) => {
  return prisma.user.update({
    where: { id: userId },
    data: { role: role as UserRole },
  });
};

export const moderateListingStatus = async (listingId: string, status: string) => {
  return prisma.listing.update({
    where: { id: listingId },
    data: { status: status as ListingStatus },
  });
};

export const fetchAdminReports = async () => {
  const recentUsers = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5,
    select: {
      id: true,
      email: true,
      firstName: true,
      role: true,
      createdAt: true,
    },
  });

  const recentPayments = await prisma.payment.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5,
    select: {
      id: true,
      amount: true,
      currency: true,
      paymentMethod: true,
      paymentGateway: true,
      status: true,
      createdAt: true,
      userId: true,
      listingId: true,
    },
  });

  const recentListings = await prisma.listing.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5,
    select: {
      id: true,
      title: true,
      status: true,
      createdAt: true,
      sellerId: true,
    },
  });

  return {
    recentUsers,
    recentPayments,
    recentListings,
  };
};
