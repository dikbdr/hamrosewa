import { Request, Response, NextFunction } from 'express';
import {
  getUserById,
  updateUserProfile,
  changeUserPassword,
  uploadProfileImage,
  getUserDashboardSummary,
} from '../services/userService';

export const getMyProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const user = await getUserById(userId);
    const { password, emailVerificationToken, ...safeUser } = user;

    res.status(200).json({ success: true, data: safeUser });
  } catch (error) {
    next(error);
  }
};

export const updateMyProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const updatedUser = await updateUserProfile(userId, req.body);
    const { password, emailVerificationToken, ...safeUser } = updatedUser;

    res.status(200).json({ success: true, message: 'Profile updated successfully', data: safeUser });
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Current and new password are required' });
    }

    await changeUserPassword(userId, currentPassword, newPassword);
    res.status(200).json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    next(error);
  }
};

export const uploadAvatar = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const { imageData } = req.body;
    if (!imageData || typeof imageData !== 'string') {
      return res.status(400).json({ success: false, message: 'Image data is required' });
    }

    const user = await uploadProfileImage(userId, imageData);
    const { password, emailVerificationToken, ...safeUser } = user;

    res.status(200).json({ success: true, message: 'Profile image uploaded successfully', data: safeUser });
  } catch (error) {
    next(error);
  }
};

export const getDashboard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const dashboard = await getUserDashboardSummary(userId);
    res.status(200).json({ success: true, data: dashboard });
  } catch (error) {
    next(error);
  }
};
