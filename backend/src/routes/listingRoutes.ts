import { Router } from 'express';
import { authenticate, authorize } from '../middleware/authMiddleware';
import {
  getListings,
  getListing,
  createNewListing,
  updateExistingListing,
  deactivateListingHandler,
} from '../controllers/listingController';

const router = Router();

router.get('/', getListings);
router.get('/:id', getListing);
router.post('/', authenticate, authorize('SELLER', 'ADMIN'), createNewListing);
router.patch('/:id', authenticate, authorize('SELLER', 'ADMIN'), updateExistingListing);
router.delete('/:id', authenticate, authorize('SELLER', 'ADMIN'), deactivateListingHandler);

export default router;
