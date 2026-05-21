import prisma from '../config/prisma';

export interface ListingCreateData {
  title: string;
  description: string;
  categoryId: string;
  price: number;
  negotiable?: boolean;
  condition?: string;
  city: string;
  district: string;
  address?: string;
  sellerPhone?: string;
  sellerEmail?: string;
  featured?: boolean;
  boosted?: boolean;
  expiresAt?: string;
  images?: string[];
  sellerId: string;
}

export interface ListingUpdateData {
  title?: string;
  description?: string;
  categoryId?: string;
  price?: number;
  negotiable?: boolean;
  condition?: string;
  city?: string;
  district?: string;
  address?: string;
  sellerPhone?: string;
  sellerEmail?: string;
  status?: string;
  featured?: boolean;
  boosted?: boolean;
  boostedUntil?: string;
  expiresAt?: string;
  images?: string[];
}

const normalizeSlug = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

export interface ListingFilterOptions {
  categorySlug?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  city?: string;
  district?: string;
  status?: string;
  condition?: string;
  featured?: boolean;
}

export const listListings = async (filters: ListingFilterOptions = {}) => {
  const where: any = {
    status: filters.status ?? 'ACTIVE',
  };

  if (filters.categorySlug) {
    where.category = {
      slug: filters.categorySlug,
    };
  }

  if (filters.search) {
    where.OR = [
      { title: { contains: filters.search, mode: 'insensitive' } },
      { description: { contains: filters.search, mode: 'insensitive' } },
    ];
  }

  if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
    where.price = {};
    if (filters.minPrice !== undefined) {
      where.price.gte = filters.minPrice;
    }
    if (filters.maxPrice !== undefined) {
      where.price.lte = filters.maxPrice;
    }
  }

  if (filters.city) {
    where.city = { equals: filters.city, mode: 'insensitive' };
  }

  if (filters.district) {
    where.district = { equals: filters.district, mode: 'insensitive' };
  }

  if (filters.condition) {
    where.condition = filters.condition;
  }

  if (filters.featured !== undefined) {
    where.featured = filters.featured;
  }

  return prisma.listing.findMany({
    where,
    orderBy: [
      { featured: 'desc' },
      { createdAt: 'desc' },
    ],
    include: {
      category: true,
      images: true,
    },
  });
};

export const getListingById = async (listingId: string) => {
  const listing = await prisma.listing.findUnique({
    where: { id: listingId },
    include: {
      category: true,
      images: true,
    },
  });

  if (!listing) {
    throw new Error('Listing not found');
  }

  return listing;
};

export const createListing = async (data: ListingCreateData) => {
  const slug = normalizeSlug(data.title);
  const existingListing = await prisma.listing.findUnique({ where: { slug } });
  if (existingListing) {
    throw new Error('Listing slug already exists');
  }

  const category = await prisma.category.findUnique({ where: { id: data.categoryId } });
  if (!category) {
    throw new Error('Category not found');
  }

  const expiresAt = data.expiresAt ? new Date(data.expiresAt) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

  const listing = await prisma.listing.create({
    data: {
      title: data.title,
      slug,
      description: data.description,
      categoryId: data.categoryId,
      price: data.price,
      negotiable: data.negotiable ?? false,
      condition: (data.condition as any) ?? 'USED',
      city: data.city,
      district: data.district,
      address: data.address,
      sellerPhone: data.sellerPhone,
      sellerEmail: data.sellerEmail,
      featured: data.featured ?? false,
      boosted: data.boosted ?? false,
      expiresAt,
      sellerId: data.sellerId,
    },
  });

  if (data.images && data.images.length > 0) {
    await prisma.listingImage.createMany({
      data: data.images.map((url, index) => ({
        listingId: listing.id,
        url,
        publicId: url,
        position: index + 1,
      })),
    });
  }

  return getListingById(listing.id);
};

export const updateListing = async (
  listingId: string,
  data: ListingUpdateData,
  currentUser: { id: string; role: string }
) => {
  const listing = await prisma.listing.findUnique({ where: { id: listingId } });
  if (!listing) {
    throw new Error('Listing not found');
  }

  if (currentUser.role !== 'ADMIN' && listing.sellerId !== currentUser.id) {
    throw new Error('Forbidden');
  }

  if (data.categoryId) {
    const category = await prisma.category.findUnique({ where: { id: data.categoryId } });
    if (!category) {
      throw new Error('Category not found');
    }
  }

  const updatePayload: any = {
    description: data.description,
    categoryId: data.categoryId,
    price: data.price,
    negotiable: data.negotiable,
    condition: data.condition,
    city: data.city,
    district: data.district,
    address: data.address,
    sellerPhone: data.sellerPhone,
    sellerEmail: data.sellerEmail,
    status: data.status,
    featured: data.featured,
    boosted: data.boosted,
    boostedUntil: data.boostedUntil ? new Date(data.boostedUntil) : undefined,
    expiresAt: data.expiresAt ? new Date(data.expiresAt) : undefined,
  };

  if (data.title) {
    updatePayload.title = data.title;
    updatePayload.slug = normalizeSlug(data.title);
  }

  const updatedListing = await prisma.listing.update({
    where: { id: listingId },
    data: updatePayload,
  });

  if (data.images) {
    await prisma.listingImage.deleteMany({ where: { listingId } });
    if (data.images.length > 0) {
      await prisma.listingImage.createMany({
        data: data.images.map((url, index) => ({
          listingId,
          url,
          publicId: url,
          position: index + 1,
        })),
      });
    }
  }

  return getListingById(updatedListing.id);
};

export const deactivateListing = async (
  listingId: string,
  currentUser: { id: string; role: string }
) => {
  const listing = await prisma.listing.findUnique({ where: { id: listingId } });
  if (!listing) {
    throw new Error('Listing not found');
  }

  if (currentUser.role !== 'ADMIN' && listing.sellerId !== currentUser.id) {
    throw new Error('Forbidden');
  }

  return prisma.listing.update({
    where: { id: listingId },
    data: { status: 'INACTIVE' },
  });
};
