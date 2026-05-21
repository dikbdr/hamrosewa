import { Router } from 'express';
import {
  getCategories,
  getCategory,
  createNewCategory,
  updateExistingCategory,
  deactivateCategory,
} from '../controllers/categoryController';
import { authenticate, authorize } from '../middleware/authMiddleware';

const router = Router();

router.get('/', getCategories);
router.get('/:id', getCategory);

router.post('/', authenticate, authorize('ADMIN'), createNewCategory);
router.patch('/:id', authenticate, authorize('ADMIN'), updateExistingCategory);
router.delete('/:id', authenticate, authorize('ADMIN'), deactivateCategory);

export default router;
