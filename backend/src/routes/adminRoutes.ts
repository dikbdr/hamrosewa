import { Router } from 'express';
import { authenticate, authorize } from '../middleware/authMiddleware';
import { getAdminOverview, getAdminReports, getUsers, changeUserRole, reviewListing } from '../controllers/adminController';

const router = Router();

router.get('/overview', authenticate, authorize('ADMIN'), getAdminOverview);
router.get('/reports', authenticate, authorize('ADMIN'), getAdminReports);
router.get('/users', authenticate, authorize('ADMIN'), getUsers);
router.patch('/users/:id/role', authenticate, authorize('ADMIN'), changeUserRole);
router.patch('/listings/:id/review', authenticate, authorize('ADMIN'), reviewListing);

export default router;
