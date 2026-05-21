import axios from 'axios';

type ListingImagePayload = {
  id: string;
  url: string;
  position: number;
};

type ListingPayload = {
  id: string;
  title: string;
  slug: string;
  description: string;
  categoryId: string;
  category?: {
    id: string;
    name: string;
    slug: string;
  };
  price: number;
  negotiable: boolean;
  condition: string;
  city: string;
  district: string;
  address?: string;
  status: string;
  featured: boolean;
  boosted: boolean;
  views: number;
  images: ListingImagePayload[];
  sellerId: string;
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
};

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface ListingSearchFilters {
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  city?: string;
  district?: string;
  status?: string;
  condition?: string;
  featured?: boolean;
}

export const fetchListings = async (filters: ListingSearchFilters = {}) => {
  return api.get<{ data: ListingPayload[] }>('/listings', {
    params: filters,
  });
};

export const fetchListingById = async (listingId: string) => {
  return api.get<{ data: ListingPayload }>(`/listings/${listingId}`);
};

export const createListing = async (token: string, payload: {
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
}) => {
  return api.post('/listings', payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const updateListing = async (token: string, listingId: string, payload: {
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
  expiresAt?: string;
  images?: string[];
}) => {
  return api.patch(`/listings/${listingId}`, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const deleteListing = async (token: string, listingId: string) => {
  return api.delete(`/listings/${listingId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
