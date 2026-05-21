import { Request, Response, NextFunction } from 'express';
import {
  listCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../services/categoryService';

export const getCategories = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const categories = await listCategories();
    res.status(200).json({ success: true, data: categories });
  } catch (error) {
    next(error);
  }
};

export const getCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const category = await getCategoryById(id);
    res.status(200).json({ success: true, data: category });
  } catch (error) {
    next(error);
  }
};

export const createNewCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const category = await createCategory(req.body);
    res.status(201).json({ success: true, message: 'Category created successfully', data: category });
  } catch (error) {
    next(error);
  }
};

export const updateExistingCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const category = await updateCategory(id, req.body);
    res.status(200).json({ success: true, message: 'Category updated successfully', data: category });
  } catch (error) {
    next(error);
  }
};

export const deactivateCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const category = await deleteCategory(id);
    res.status(200).json({ success: true, message: 'Category deactivated successfully', data: category });
  } catch (error) {
    next(error);
  }
};
