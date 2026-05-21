import { Request, Response, NextFunction } from 'express';
import {
  listListings,
  getListingById,
  createListing,
  updateListing,
  deactivateListing,
} from '../services/listingService';

export const getListings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const category = typeof req.query.category === 'string' ? req.query.category : undefined;
    const search = typeof req.query.search === 'string' ? req.query.search : undefined;
    const minPrice = typeof req.query.minPrice === 'string' ? Number(req.query.minPrice) : undefined;
    const maxPrice = typeof req.query.maxPrice === 'string' ? Number(req.query.maxPrice) : undefined;
    const city = typeof req.query.city === 'string' ? req.query.city : undefined;
    const district = typeof req.query.district === 'string' ? req.query.district : undefined;
    const status = typeof req.query.status === 'string' ? req.query.status : undefined;
    const condition = typeof req.query.condition === 'string' ? req.query.condition : undefined;
    const featured = typeof req.query.featured === 'string' ? req.query.featured === 'true' : undefined;

    const listings = await listListings({
      categorySlug: category,
      search,
      minPrice,
      maxPrice,
      city,
      district,
      status,
      condition,
      featured,
    });

    res.status(200).json({ success: true, data: listings });
  } catch (error) {
    next(error);
  }
};

export const getListing = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const listing = await getListingById(id);
    res.status(200).json({ success: true, data: listing });
  } catch (error) {
    next(error);
  }
};

export const createNewListing = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as any).user;
    const listing = await createListing({
      ...req.body,
      sellerId: user.id,
    });
    res.status(201).json({ success: true, message: 'Listing created successfully', data: listing });
  } catch (error) {
    next(error);
  }
};

export const updateExistingListing = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const user = (req as any).user;
    const listing = await updateListing(id, req.body, user);
    res.status(200).json({ success: true, message: 'Listing updated successfully', data: listing });
  } catch (error) {
    next(error);
  }
};

export const deactivateListingHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const user = (req as any).user;
    const listing = await deactivateListing(id, user);
    res.status(200).json({ success: true, message: 'Listing deactivated successfully', data: listing });
  } catch (error) {
    next(error);
  }
};
