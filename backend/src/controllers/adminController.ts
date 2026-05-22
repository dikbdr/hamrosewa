import { Request, Response, NextFunction } from 'express';
import {
  fetchAdminOverview,
  fetchAdminReports,
  fetchUsers,
  updateUserRole,
  moderateListingStatus,
} from '../services/adminService';
import { auditLog } from '../utils/auditLogger';

export const getAdminOverview = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const overview = await fetchAdminOverview();
    res.status(200).json({ success: true, data: overview });
  } catch (error) {
    next(error);
  }
};

export const getAdminReports = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const reports = await fetchAdminReports();
    res.status(200).json({ success: true, data: reports });
  } catch (error) {
    next(error);
  }
};

export const getUsers = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await fetchUsers();
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    next(error);
  }
};

export const changeUserRole = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    const admin = (req as any).user;
    if (!role) {
      return res.status(400).json({ success: false, message: 'Role is required' });
    }
    const user = await updateUserRole(id, role);
    auditLog('admin.changeUserRole', { adminId: admin.id, targetUserId: id, role });
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

export const reviewListing = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const admin = (req as any).user;
    if (!status) {
      return res.status(400).json({ success: false, message: 'Status is required' });
    }
    const listing = await moderateListingStatus(id, status);
    auditLog('admin.reviewListing', { adminId: admin.id, listingId: id, status });
    res.status(200).json({ success: true, data: listing });
  } catch (error) {
    next(error);
  }
};
